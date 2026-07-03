import { Search } from "lucide-react";
import BookCover from "@/components/BookCover";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();
  const user = await getCurrentUser();

  const books = query
    ? (
        await prisma.book.findMany({
          where: { status: "APPROVED" },
          include: { submittedBy: true, shelf: true, tips: true },
          orderBy: { createdAt: "desc" },
        })
      ).filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.authorName.toLowerCase().includes(query) ||
          book.shelf.name.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query)
      )
    : [];

  const savedIds = user
    ? new Set(
        (await prisma.savedBook.findMany({ where: { userId: user.id }, select: { bookId: true } })).map(
          (s) => s.bookId
        )
      )
    : new Set<string>();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display mb-6 text-2xl">Search the library</h1>
      <form className="mx-auto mb-10 flex max-w-lg items-center gap-2 rounded-full border border-shelf-line bg-paper-raised px-4 py-2.5 shadow-sm">
        <Search className="h-4 w-4 text-ink-muted" />
        <input
          name="q"
          defaultValue={q}
          autoFocus
          placeholder="Search books, authors, or categories…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink-muted"
        />
        <button className="shrink-0 rounded-full bg-accent px-4 py-1.5 text-sm text-paper-raised hover:bg-accent-hover">
          Search
        </button>
      </form>

      {!query ? (
        <p className="text-center text-ink-muted">Start typing to search approved books on the shelf.</p>
      ) : books.length === 0 ? (
        <p className="text-center text-ink-muted">No approved books match &ldquo;{q}&rdquo;.</p>
      ) : (
        <>
          <p className="mb-6 text-sm text-ink-muted">
            {books.length} result{books.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-10">
            {books.map((book) => (
              <BookCover
                key={book.id}
                book={book}
                isSaved={savedIds.has(book.id)}
                currentUser={user ? { id: user.id, walletBalance: user.walletBalance } : null}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
