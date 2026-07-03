import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookMarked, Bookmark, Coins } from "lucide-react";
import PlaceholderCover from "@/components/PlaceholderCover";
import Badge from "@/components/Badge";
import BookDetailActions from "@/components/BookDetailActions";
import GuestbookSection from "@/components/GuestbookSection";
import BookCover from "@/components/BookCover";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { bookBadge } from "@/lib/book-helpers";
import { OWNERSHIP_LABEL } from "@/lib/format";

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      submittedBy: true,
      shelf: true,
      tips: true,
      guestbookEntries: { where: { status: "visible" }, orderBy: { createdAt: "desc" }, include: { user: true } },
    },
  });

  if (!book) notFound();
  if (book.status !== "APPROVED" && book.submittedById !== user?.id && user?.role !== "ADMIN") {
    notFound();
  }

  const [isSaved, similar] = await Promise.all([
    user
      ? Boolean(await prisma.savedBook.findUnique({ where: { userId_bookId: { userId: user.id, bookId: id } } }))
      : false,
    prisma.book.findMany({
      where: { shelfId: book.shelfId, status: "APPROVED", NOT: { id: book.id } },
      include: { submittedBy: true, shelf: true, tips: true },
      take: 6,
    }),
  ]);

  const badge = bookBadge(book);
  const tipsTotal = book.tips.reduce((sum, tip) => sum + tip.amount, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> Back to shelf
      </Link>

      {book.status !== "APPROVED" && (
        <div className="mb-6 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-wood-dark">
          This book is not public yet — status: <strong>{book.status.replace("_", " ")}</strong>.
          {book.reviewNote && <span> Reviewer note: {book.reviewNote}</span>}
        </div>
      )}

      <div className="grid gap-10 md:grid-cols-[240px_1fr]">
        <div className="relative h-[340px] w-[240px] overflow-hidden rounded-lg shadow-[0_16px_30px_rgba(60,45,25,0.25)]">
          {book.coverUrl ? (
            <Image src={book.coverUrl} alt={book.title} fill className="object-cover" />
          ) : (
            <PlaceholderCover title={book.title} author={book.authorName} />
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge label={badge} />
            <span className="text-xs text-ink-muted">{book.shelf.name}</span>
          </div>
          <h1 className="font-display text-3xl">{book.title}</h1>
          <p className="mt-1 text-ink-muted">
            by {book.authorName} · submitted by {book.submittedBy.name}
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            {book.language} · {OWNERSHIP_LABEL[book.ownershipType]}
          </p>

          <p className="mt-5 leading-relaxed">{book.description}</p>

          <div className="mt-6 flex gap-6 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <BookMarked className="h-4 w-4" /> {book.reads} reads
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Bookmark className="h-4 w-4" /> {book.saveCount} saves
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Coins className="h-4 w-4" /> ₦{tipsTotal.toLocaleString("en-NG")} tipped
            </span>
          </div>

          <div className="mt-6">
            <BookDetailActions
              book={book}
              isSaved={isSaved}
              currentUser={user ? { id: user.id, walletBalance: user.walletBalance } : null}
            />
          </div>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="font-display mb-4 text-xl">Guestbook</h2>
        <GuestbookSection bookId={book.id} entries={book.guestbookEntries} canPost={Boolean(user)} />
      </section>

      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display mb-4 text-xl">More from {book.shelf.name}</h2>
          <div className="flex flex-wrap gap-6">
            {similar.map((b) => (
              <BookCover key={b.id} book={b} isSaved={false} currentUser={user ? { id: user.id, walletBalance: user.walletBalance } : null} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
