import { prisma } from "@/lib/prisma";

export const VIRTUAL_SHELVES = [
  {
    slug: "featured",
    name: "Featured Books",
    description: "Hand-picked reads the OpenShelf team loves right now.",
  },
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    description: "The newest approved additions to the library.",
  },
  {
    slug: "most-read",
    name: "Most Read",
    description: "What the community can't stop opening.",
  },
  {
    slug: "top-tipped",
    name: "Top Tipped Books",
    description: "Verified authors readers are supporting the most.",
  },
] as const;

const BOOK_INCLUDE = { submittedBy: true, shelf: true, tips: true } as const;

async function virtualShelfBooks(slug: string, take?: number) {
  const approved = { status: "APPROVED" as const };

  if (slug === "featured") {
    return prisma.book.findMany({
      where: approved,
      orderBy: [{ reads: "desc" }, { saveCount: "desc" }],
      take,
      include: BOOK_INCLUDE,
    });
  }
  if (slug === "new-arrivals") {
    return prisma.book.findMany({ where: approved, orderBy: { createdAt: "desc" }, take, include: BOOK_INCLUDE });
  }
  if (slug === "most-read") {
    return prisma.book.findMany({ where: approved, orderBy: { reads: "desc" }, take, include: BOOK_INCLUDE });
  }
  if (slug === "top-tipped") {
    const books = await prisma.book.findMany({ where: approved, include: BOOK_INCLUDE });
    const sorted = books
      .map((book) => ({ book, total: book.tips.reduce((sum, tip) => sum + tip.amount, 0) }))
      .sort((a, b) => b.total - a.total)
      .filter((entry) => entry.total > 0)
      .map((entry) => entry.book);
    return take ? sorted.slice(0, take) : sorted;
  }
  return [];
}

export async function getShelfBySlug(slug: string, take?: number) {
  const virtual = VIRTUAL_SHELVES.find((s) => s.slug === slug);
  if (virtual) {
    const books = await virtualShelfBooks(slug, take);
    return { ...virtual, books };
  }

  const shelf = await prisma.shelf.findUnique({ where: { slug } });
  if (!shelf) return null;

  const books = await prisma.book.findMany({
    where: { shelfId: shelf.id, status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take,
    include: BOOK_INCLUDE,
  });

  return { slug: shelf.slug, name: shelf.name, description: shelf.description, books };
}

export async function getHomeShelves(take = 12) {
  const categoryShelves = await prisma.shelf.findMany({ orderBy: { order: "asc" } });

  const rows = await Promise.all([
    getShelfBySlug("featured", take),
    getShelfBySlug("new-arrivals", take),
    getShelfBySlug("most-read", take),
    ...categoryShelves.map((shelf) => getShelfBySlug(shelf.slug, take)),
    getShelfBySlug("top-tipped", take),
  ]);

  return rows.filter((row): row is NonNullable<typeof row> => Boolean(row));
}

export async function getSavedBookIds(userId: string | null) {
  if (!userId) return new Set<string>();
  const saved = await prisma.savedBook.findMany({ where: { userId }, select: { bookId: true } });
  return new Set(saved.map((s) => s.bookId));
}
