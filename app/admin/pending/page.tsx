import AdminReviewCard from "@/components/AdminReviewCard";
import { prisma } from "@/lib/prisma";

export default async function PendingBooksPage() {
  const books = await prisma.book.findMany({
    where: { status: { in: ["UNDER_REVIEW", "NEEDS_CHANGES"] } },
    orderBy: { createdAt: "asc" },
    include: { shelf: true, submittedBy: true },
  });

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl">Pending Books ({books.length})</h1>
      {books.length === 0 ? (
        <p className="text-ink-muted">Nothing waiting on review — the queue is clear.</p>
      ) : (
        <div className="space-y-5">
          {books.map((book) => (
            <AdminReviewCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
