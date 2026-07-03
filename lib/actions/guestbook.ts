"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { POINT_VALUES } from "@/lib/rewards";

type FormState = { error?: string; success?: boolean };

export async function postGuestbookEntry(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to leave a note in the guestbook." };

  const bookId = String(formData.get("bookId"));
  const note = String(formData.get("note") ?? "").trim();
  const type = String(formData.get("type") ?? "note");

  if (!note) return { error: "Write something before posting." };
  if (note.length > 500) return { error: "Keep notes under 500 characters." };

  await prisma.guestbookEntry.create({
    data: { bookId, userId: user.id, note, type },
  });

  revalidatePath(`/book/${bookId}`);
  revalidatePath(`/book/${bookId}/read`);
  return { success: true };
}

export async function markHelpful(entryId: string, bookId: string) {
  const entry = await prisma.guestbookEntry.update({
    where: { id: entryId },
    data: { helpfulCount: { increment: 1 } },
  });

  if (entry.helpfulCount >= 5 && !entry.rewarded) {
    await prisma.$transaction([
      prisma.guestbookEntry.update({ where: { id: entryId }, data: { rewarded: true } }),
      prisma.user.update({
        where: { id: entry.userId },
        data: { points: { increment: POINT_VALUES.HELPFUL_GUESTBOOK_NOTE } },
      }),
      prisma.rewardLog.create({
        data: {
          userId: entry.userId,
          action: "Guestbook note marked helpful",
          points: POINT_VALUES.HELPFUL_GUESTBOOK_NOTE,
        },
      }),
    ]);
  }

  revalidatePath(`/book/${bookId}`);
  revalidatePath(`/book/${bookId}/read`);
}

export async function reportGuestbookEntry(entryId: string, bookId: string) {
  const user = await getCurrentUser();
  if (!user) return;

  await prisma.$transaction([
    prisma.guestbookEntry.update({ where: { id: entryId }, data: { reported: true } }),
    prisma.report.create({
      data: {
        targetType: "guestbook",
        targetId: entryId,
        bookId,
        reason: "Reported as inappropriate by a reader",
        reportedById: user.id,
      },
    }),
  ]);

  revalidatePath(`/book/${bookId}`);
  revalidatePath("/admin/reports");
}
