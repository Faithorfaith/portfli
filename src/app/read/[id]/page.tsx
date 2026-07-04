import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getGuestId } from "@/lib/guest";
import { toBigCoverDTO } from "@/lib/dto";
import { getBookDetailRow } from "@/lib/queries";
import { Reader } from "@/components/Reader";

export default async function ReadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookId = Number(id);
  if (!Number.isInteger(bookId)) notFound();

  const guestId = await getGuestId();
  const [row, pages, bookmarks] = await Promise.all([
    getBookDetailRow(bookId),
    db.page.findMany({ where: { bookId }, orderBy: { index: "asc" } }),
    db.bookmark.findMany({ where: { bookId, guestId } }),
  ]);
  if (!row) notFound();

  return (
    <Reader
      book={toBigCoverDTO(row)}
      pages={pages.map((p) => p.text)}
      initialBookmarkedSpreads={bookmarks.map((b) => b.spread)}
    />
  );
}
