import { notFound } from "next/navigation";
import ReaderView from "@/components/ReaderView";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function ReadBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  const book = await prisma.book.findUnique({ where: { id }, include: { submittedBy: true } });
  if (!book || !book.fileUrl) notFound();
  if (book.status !== "APPROVED" && book.submittedById !== user?.id && user?.role !== "ADMIN") {
    notFound();
  }

  const isSaved = user
    ? Boolean(await prisma.savedBook.findUnique({ where: { userId_bookId: { userId: user.id, bookId: id } } }))
    : false;

  return (
    <ReaderView
      book={{ ...book, fileUrl: book.fileUrl }}
      isSaved={isSaved}
      currentUser={user ? { id: user.id, walletBalance: user.walletBalance } : null}
    />
  );
}
