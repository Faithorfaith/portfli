"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canReceiveTips, PLATFORM_COMMISSION } from "@/lib/book-helpers";
import type { OwnershipType } from "@/app/generated/prisma/enums";

export async function toggleSave(bookId: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/signin?redirectTo=/book/${bookId}`);

  const existing = await prisma.savedBook.findUnique({
    where: { userId_bookId: { userId: user.id, bookId } },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.savedBook.delete({ where: { id: existing.id } }),
      prisma.book.update({ where: { id: bookId }, data: { saveCount: { decrement: 1 } } }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.savedBook.create({ data: { userId: user.id, bookId } }),
      prisma.book.update({ where: { id: bookId }, data: { saveCount: { increment: 1 } } }),
    ]);
  }

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/book/${bookId}`);
  revalidatePath("/profile");
}

export async function recordRead(bookId: string) {
  const book = await prisma.book.update({
    where: { id: bookId },
    data: { reads: { increment: 1 } },
  });

  const { READ_MILESTONES, POINT_VALUES } = await import("@/lib/rewards");
  const nextMilestone = READ_MILESTONES.find(
    (m) => book.reads >= m && book.milestoneAwarded < m
  );
  if (nextMilestone) {
    await prisma.$transaction([
      prisma.book.update({ where: { id: bookId }, data: { milestoneAwarded: nextMilestone } }),
      prisma.user.update({
        where: { id: book.submittedById },
        data: { points: { increment: POINT_VALUES.READ_MILESTONE } },
      }),
      prisma.rewardLog.create({
        data: {
          userId: book.submittedById,
          action: `"${book.title}" reached ${nextMilestone} reads`,
          points: POINT_VALUES.READ_MILESTONE,
        },
      }),
    ]);
  }
}

type TipState = { error?: string; success?: boolean };

export async function tipBook(_prev: TipState, formData: FormData): Promise<TipState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to send a tip." };

  const bookId = String(formData.get("bookId"));
  const amount = Number(formData.get("amount"));

  if (!Number.isFinite(amount) || amount < 50) {
    return { error: "Enter a tip amount of at least ₦50." };
  }
  if (amount > user.walletBalance) {
    return { error: "Your demo wallet balance is too low for this tip." };
  }

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: { submittedBy: true },
  });
  if (!book) return { error: "Book not found." };
  if (!canReceiveTips(book)) {
    return { error: "This book is not eligible to receive tips." };
  }
  if (book.submittedById === user.id) {
    return { error: "You can't tip your own book." };
  }

  const net = Math.round(amount * (1 - PLATFORM_COMMISSION));

  await prisma.$transaction([
    prisma.tip.create({
      data: { bookId, fromUserId: user.id, toUserId: book.submittedById, amount },
    }),
    prisma.user.update({ where: { id: user.id }, data: { walletBalance: { decrement: amount } } }),
    prisma.user.update({ where: { id: book.submittedById }, data: { earnings: { increment: net } } }),
  ]);

  revalidatePath(`/book/${bookId}`);
  revalidatePath("/profile");
  revalidatePath("/rewards");
  return { success: true };
}

export async function reportBook(_prev: TipState, formData: FormData): Promise<TipState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to submit a report." };

  const bookId = String(formData.get("bookId"));
  const reason = String(formData.get("reason") ?? "").trim();
  if (!reason) return { error: "Please describe the issue." };

  await prisma.report.create({
    data: { targetType: "book", targetId: bookId, bookId, reason, reportedById: user.id },
  });

  revalidatePath("/admin/reports");
  return { success: true };
}

type SubmitState = { error?: string; bookId?: string };

export async function submitBook(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in before submitting a book." };

  const title = String(formData.get("title") ?? "").trim();
  const authorName = String(formData.get("authorName") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const language = String(formData.get("language") ?? "English").trim();
  const shelfId = String(formData.get("shelfId") ?? "");
  const ownershipType = String(formData.get("ownershipType") ?? "") as OwnershipType;
  const coverUrl = String(formData.get("coverUrl") ?? "") || null;
  const fileUrl = String(formData.get("fileUrl") ?? "") || null;
  const fileType = String(formData.get("fileType") ?? "") || null;

  if (!title || !authorName || !description || !shelfId || !ownershipType) {
    return { error: "Please complete every step before submitting." };
  }
  if (!fileUrl) {
    return { error: "Please upload a PDF or EPUB file first." };
  }
  const validOwnership: OwnershipType[] = ["WROTE", "PERMISSION", "PUBLIC_DOMAIN", "FREE_LICENSED"];
  if (!validOwnership.includes(ownershipType)) {
    return { error: "Select an ownership option." };
  }

  const book = await prisma.book.create({
    data: {
      title,
      authorName,
      description,
      language,
      shelfId,
      ownershipType,
      coverUrl,
      fileUrl,
      fileType,
      status: "UNDER_REVIEW",
      submittedById: user.id,
    },
  });

  revalidatePath("/admin/pending");
  revalidatePath("/profile");
  return { bookId: book.id };
}
