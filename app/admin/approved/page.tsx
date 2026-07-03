import AdminApprovedList from "@/components/AdminApprovedList";
import { prisma } from "@/lib/prisma";

export default async function ApprovedBooksPage() {
  const books = await prisma.book.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    include: { shelf: true, submittedBy: true, tips: true },
  });

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl">Approved Books ({books.length})</h1>
      {books.length === 0 ? (
        <p className="text-ink-muted">No approved books yet.</p>
      ) : (
        <AdminApprovedList books={books} />
      )}
    </div>
  );
}
