import { db } from "./db";
import { toSpineDTO, type ShelfDTO, type DetailBookRow } from "./dto";

export async function getShelvesWithSpines(): Promise<ShelfDTO[]> {
  const shelves = await db.shelf.findMany({
    orderBy: { order: "asc" },
    include: { books: { orderBy: { order: "asc" } } },
  });
  return shelves.map((shelf) => ({
    id: shelf.id,
    label: shelf.label,
    description: shelf.description,
    count: `${shelf.books.length} book${shelf.books.length === 1 ? "" : "s"}`,
    empty: false,
    books: shelf.books.map(toSpineDTO),
  }));
}

export async function getBookDetailRow(bookId: number): Promise<DetailBookRow | null> {
  const book = await db.book.findUnique({ where: { id: bookId }, include: { shelf: true } });
  if (!book) return null;
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    badge: book.badge,
    bg: book.bg,
    ink: book.ink,
    accent: book.accent,
    styleIndex: book.styleIndex,
    dimIndex: book.dimIndex,
    lean: book.lean,
    description: book.description,
    reads: book.reads,
    saveCount: book.saveCount,
    tipCount: book.tipCount,
    shelfLabel: book.shelf.label,
  };
}
