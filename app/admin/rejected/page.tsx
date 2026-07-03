import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function RejectedBooksPage() {
  const books = await prisma.book.findMany({
    where: { status: "REJECTED" },
    orderBy: { updatedAt: "desc" },
    include: { shelf: true, submittedBy: true },
  });

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl">Rejected Books ({books.length})</h1>
      {books.length === 0 ? (
        <p className="text-ink-muted">No rejected submissions.</p>
      ) : (
        <ul className="divide-y divide-shelf-line rounded-xl border border-shelf-line bg-paper-raised">
          {books.map((book) => (
            <li key={book.id} className="px-4 py-3">
              <Link href={`/book/${book.id}`} className="font-medium hover:text-accent">
                {book.title}
              </Link>
              <p className="text-xs text-ink-muted">
                {book.authorName} · submitted by {book.submittedBy.name} · {book.shelf.name}
              </p>
              {book.reviewNote && <p className="mt-1 text-sm text-accent">Reason: {book.reviewNote}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
