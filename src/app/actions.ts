"use server";

import { db } from "@/lib/db";
import { getGuestId } from "@/lib/guest";
import { toBigCoverDTO } from "@/lib/dto";
import { getBookDetailRow } from "@/lib/queries";
import { getSiteSettings, type SiteSettings } from "@/lib/settings";

export type NoteDTO = {
  id: number;
  name: string;
  note: string;
  helpful: number;
  markedByMe: boolean;
};

export type BookDetail = {
  book: ReturnType<typeof toBigCoverDTO>;
  saved: boolean;
  notes: NoteDTO[];
};

export async function getBookDetail(bookId: number): Promise<BookDetail | null> {
  const [row, guestId] = await Promise.all([getBookDetailRow(bookId), getGuestId()]);
  if (!row) return null;

  const [save, notes] = await Promise.all([
    db.save.findUnique({ where: { bookId_guestId: { bookId, guestId } } }),
    db.note.findMany({
      where: { bookId },
      orderBy: { id: "asc" },
      include: { helpfulBy: { where: { guestId } } },
    }),
  ]);

  return {
    book: toBigCoverDTO(row),
    saved: !!save,
    notes: notes.map((n) => ({
      id: n.id,
      name: n.name,
      note: n.note,
      helpful: n.helpful,
      markedByMe: n.helpfulBy.length > 0,
    })),
  };
}

export async function toggleSave(bookId: number): Promise<{ saved: boolean }> {
  const guestId = await getGuestId();
  const existing = await db.save.findUnique({ where: { bookId_guestId: { bookId, guestId } } });
  if (existing) {
    await db.save.delete({ where: { id: existing.id } });
    return { saved: false };
  }
  await db.save.create({ data: { bookId, guestId } });
  return { saved: true };
}

export async function addGuestbookNote(bookId: number, text: string): Promise<NoteDTO | null> {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const guestId = await getGuestId();
  const note = await db.note.create({
    data: { bookId, guestId, name: "You", note: trimmed },
  });
  return { id: note.id, name: note.name, note: note.note, helpful: note.helpful, markedByMe: false };
}

export async function markNoteHelpful(noteId: number): Promise<{ helpful: number }> {
  const guestId = await getGuestId();
  const already = await db.noteHelpful.findUnique({ where: { noteId_guestId: { noteId, guestId } } });
  if (already) {
    const note = await db.note.findUniqueOrThrow({ where: { id: noteId } });
    return { helpful: note.helpful };
  }
  await db.noteHelpful.create({ data: { noteId, guestId } });
  const note = await db.note.update({ where: { id: noteId }, data: { helpful: { increment: 1 } } });
  return { helpful: note.helpful };
}

export async function reportBook(bookId: number): Promise<{ ok: true }> {
  const guestId = await getGuestId();
  await db.report.create({ data: { bookId, guestId } });
  return { ok: true };
}

export async function tipAuthor(bookId: number): Promise<{ ok: true; tipCount: number }> {
  const guestId = await getGuestId();
  const [, book] = await db.$transaction([
    db.tip.create({ data: { bookId, guestId } }),
    db.book.update({ where: { id: bookId }, data: { tipCount: { increment: 1 } } }),
  ]);
  return { ok: true, tipCount: book.tipCount };
}

export async function toggleBookmark(bookId: number, spread: number): Promise<{ bookmarked: boolean }> {
  const guestId = await getGuestId();
  const existing = await db.bookmark.findUnique({
    where: { bookId_guestId_spread: { bookId, guestId, spread } },
  });
  if (existing) {
    await db.bookmark.delete({ where: { id: existing.id } });
    return { bookmarked: false };
  }
  await db.bookmark.create({ data: { bookId, guestId, spread } });
  return { bookmarked: true };
}

export async function updateSiteSettings(input: Partial<SiteSettings>): Promise<SiteSettings> {
  await db.settings.upsert({
    where: { id: "singleton" },
    update: input,
    create: { id: "singleton", ...input },
  });
  return getSiteSettings();
}
