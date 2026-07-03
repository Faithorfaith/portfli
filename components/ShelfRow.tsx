import Link from "next/link";
import BookCover, { type ShelfBook } from "./BookCover";

export default function ShelfRow({
  slug,
  name,
  description,
  books,
  savedIds,
  currentUser,
}: {
  slug: string;
  name: string;
  description: string;
  books: ShelfBook[];
  savedIds: Set<string>;
  currentUser: { id: string; walletBalance: number } | null;
}) {
  return (
    <section className="mb-14">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl">{name}</h2>
          <p className="text-sm text-ink-muted">{description}</p>
        </div>
        <Link
          href={`/shelf/${slug}`}
          className="shrink-0 rounded-full border border-shelf-line px-4 py-1.5 text-xs whitespace-nowrap text-ink-muted transition hover:border-accent hover:text-accent"
        >
          View all · {books.length}
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="rounded-xl border border-dashed border-shelf-line py-10 text-center text-sm text-ink-muted">
          No books on this shelf yet.
        </div>
      ) : (
        <div className="relative">
          <div className="shelf-scroll flex gap-5 overflow-x-auto pb-8 pt-2">
            {books.map((book) => (
              <BookCover
                key={book.id}
                book={book}
                isSaved={savedIds.has(book.id)}
                currentUser={currentUser}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute right-0 bottom-6 left-0 h-3 rounded-full bg-wood shadow-[0_10px_14px_rgba(0,0,0,0.2)]" />
        </div>
      )}
    </section>
  );
}
