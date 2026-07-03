"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { POINT_VALUES } from "@/lib/rewards";

type FormState = { error?: string; success?: boolean };

export async function approveBook(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const bookId = String(formData.get("bookId"));
  const verifyOwner = formData.get("verifyOwner") === "on";
  const tipEligible = formData.get("tipEligible") === "on";
  const accurateMetadata = formData.get("accurateMetadata") === "on";
  const helpfulSummary = formData.get("helpfulSummary") === "on";

  const book = await prisma.book.update({
    where: { id: bookId },
    data: { status: "APPROVED", tipEligible, reviewNote: null },
  });

  const rewardLogs: { userId: string; action: string; points: number }[] = [
    { userId: book.submittedById, action: `Approved: "${book.title}"`, points: POINT_VALUES.APPROVED_UPLOAD },
  ];
  let bonus = POINT_VALUES.APPROVED_UPLOAD;
  if (accurateMetadata) {
    rewardLogs.push({ userId: book.submittedById, action: "Accurate metadata bonus", points: POINT_VALUES.ACCURATE_METADATA });
    bonus += POINT_VALUES.ACCURATE_METADATA;
  }
  if (helpfulSummary) {
    rewardLogs.push({ userId: book.submittedById, action: "Helpful summary bonus", points: POINT_VALUES.HELPFUL_SUMMARY });
    bonus += POINT_VALUES.HELPFUL_SUMMARY;
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: book.submittedById },
      data: {
        points: { increment: bonus },
        ...(verifyOwner ? { isVerified: true } : {}),
      },
    }),
    prisma.rewardLog.createMany({ data: rewardLogs }),
  ]);

  revalidatePath("/admin/pending");
  revalidatePath("/admin/approved");
  revalidatePath("/");
  revalidatePath("/rewards");
  return { success: true };
}

export async function rejectBook(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const bookId = String(formData.get("bookId"));
  const note = String(formData.get("note") ?? "").trim();
  if (!note) return { error: "Add a reason so the contributor understands." };

  await prisma.book.update({ where: { id: bookId }, data: { status: "REJECTED", reviewNote: note } });

  revalidatePath("/admin/pending");
  revalidatePath("/admin/rejected");
  return { success: true };
}

export async function requestChanges(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const bookId = String(formData.get("bookId"));
  const note = String(formData.get("note") ?? "").trim();
  if (!note) return { error: "Describe what needs to change." };

  await prisma.book.update({ where: { id: bookId }, data: { status: "NEEDS_CHANGES", reviewNote: note } });

  revalidatePath("/admin/pending");
  return { success: true };
}

export async function removeBook(bookId: string) {
  await requireAdmin();
  await prisma.book.update({ where: { id: bookId }, data: { status: "REMOVED" } });
  revalidatePath("/admin/approved");
  revalidatePath("/admin/reports");
  revalidatePath("/");
}

export async function toggleTipEligible(bookId: string) {
  await requireAdmin();
  const book = await prisma.book.findUniqueOrThrow({ where: { id: bookId } });
  await prisma.book.update({ where: { id: bookId }, data: { tipEligible: !book.tipEligible } });
  revalidatePath("/admin/approved");
  revalidatePath(`/book/${bookId}`);
}

export async function toggleVerified(userId: string) {
  await requireAdmin();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  await prisma.user.update({ where: { id: userId }, data: { isVerified: !user.isVerified } });
  revalidatePath("/admin/contributors");
  revalidatePath("/");
}

export async function resolveReport(reportId: string, outcome: "valid" | "dismissed") {
  await requireAdmin();
  const report = await prisma.report.findUniqueOrThrow({ where: { id: reportId } });

  await prisma.report.update({ where: { id: reportId }, data: { status: outcome === "valid" ? "resolved" : "dismissed" } });

  if (outcome === "valid") {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: report.reportedById },
        data: { points: { increment: POINT_VALUES.VALID_REPORT } },
      }),
      prisma.rewardLog.create({
        data: { userId: report.reportedById, action: "Valid report submitted", points: POINT_VALUES.VALID_REPORT },
      }),
    ]);
  }

  revalidatePath("/admin/reports");
}

export async function createShelf(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (!name || !slug) return { error: "Give the shelf a name." };

  const existing = await prisma.shelf.findUnique({ where: { slug } });
  if (existing) return { error: "A shelf with that name already exists." };

  const count = await prisma.shelf.count();
  await prisma.shelf.create({ data: { name, description, slug, order: count } });

  revalidatePath("/admin/shelves");
  revalidatePath("/");
  return { success: true };
}
