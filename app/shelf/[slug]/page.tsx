import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BookCover from "@/components/BookCover";
import { getShelfBySlug } from "@/lib/shelves";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ShelfPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shelf = await getShelfBySlug(slug);
  if (!shelf) notFound();

  const user = await getCurrentUser();
  const savedIds = user
    ? new Set(
        (await prisma.savedBook.findMany({ where: { userId: user.id }, select: { bookId: true } })).map(
          (s) => s.bookId
        )
      )
    : new Set<string>();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> Back to shelf
      </Link>

      <div className="mb-8 border-b border-shelf-line pb-6">
        <h1 className="font-display text-3xl">{shelf.name}</h1>
        <p className="mt-2 text-ink-muted">{shelf.description}</p>
        <p className="mt-1 text-xs tracking-wide text-ink-muted uppercase">{shelf.books.length} books</p>
      </div>

      {shelf.books.length === 0 ? (
        <div className="rounded-xl border border-dashed border-shelf-line py-16 text-center text-ink-muted">
          No books here yet — be the first to submit one for this shelf.
        </div>
      ) : (
        <div className="flex flex-wrap gap-x-6 gap-y-10">
          {shelf.books.map((book) => (
            <BookCover
              key={book.id}
              book={book}
              isSaved={savedIds.has(book.id)}
              currentUser={user ? { id: user.id, walletBalance: user.walletBalance } : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
