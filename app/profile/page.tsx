import Link from "next/link";
import { redirect } from "next/navigation";
import { Wallet } from "lucide-react";
import BookCover from "@/components/BookCover";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatNaira } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/format";
import { getLevel } from "@/lib/rewards";
import { MIN_PAYOUT_THRESHOLD } from "@/lib/book-helpers";

const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-black/5 text-ink-muted",
  UNDER_REVIEW: "bg-gold/15 text-wood-dark",
  NEEDS_CHANGES: "bg-accent/10 text-accent",
  APPROVED: "bg-verified/10 text-verified",
  REJECTED: "bg-black/10 text-ink-muted",
  REMOVED: "bg-black/10 text-ink-muted",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin?redirectTo=/profile");

  const [myBooks, savedBooks, rewardLogs] = await Promise.all([
    prisma.book.findMany({
      where: { submittedById: user.id },
      orderBy: { createdAt: "desc" },
      include: { shelf: true },
    }),
    prisma.savedBook.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { book: { include: { submittedBy: true, shelf: true, tips: true } } },
    }),
    prisma.rewardLog.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-wide text-ink-muted uppercase">{getLevel(user.points)}</p>
          <h1 className="font-display text-3xl">{user.name}</h1>
          <p className="text-sm text-ink-muted">
            {user.email} {user.isVerified && <span className="text-verified">· Verified author</span>}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl">{user.points} pts</p>
          <Link href="/rewards" className="text-sm text-accent hover:underline">
            View rewards
          </Link>
        </div>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-shelf-line bg-paper-raised p-5">
          <p className="mb-1 flex items-center gap-1.5 text-xs tracking-wide text-ink-muted uppercase">
            <Wallet className="h-3.5 w-3.5" /> Demo wallet (for tipping)
          </p>
          <p className="font-display text-2xl">{formatNaira(user.walletBalance)}</p>
          <p className="mt-1 text-xs text-ink-muted">Simulated balance — no real payment is processed on OpenShelf.</p>
        </div>
        <div className="rounded-xl border border-shelf-line bg-paper-raised p-5">
          <p className="mb-1 text-xs tracking-wide text-ink-muted uppercase">Author earnings</p>
          <p className="font-display text-2xl">{formatNaira(user.earnings)}</p>
          <p className="mt-1 text-xs text-ink-muted">
            Minimum payout threshold: {formatNaira(MIN_PAYOUT_THRESHOLD)}
          </p>
        </div>
      </div>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl">My uploads</h2>
          <Link href="/submit" className="text-sm text-accent hover:underline">
            Submit another
          </Link>
        </div>
        {myBooks.length === 0 ? (
          <p className="text-sm text-ink-muted">You haven&apos;t submitted any books yet.</p>
        ) : (
          <ul className="divide-y divide-shelf-line rounded-xl border border-shelf-line bg-paper-raised">
            {myBooks.map((book) => (
              <li key={book.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <Link href={`/book/${book.id}`} className="font-medium hover:text-accent">
                    {book.title}
                  </Link>
                  <p className="text-xs text-ink-muted">{book.shelf.name}</p>
                  {book.reviewNote && <p className="mt-1 text-xs text-accent">Reviewer note: {book.reviewNote}</p>}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[book.status]}`}>
                  {STATUS_LABEL[book.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-10">
        <h2 className="font-display mb-4 text-xl">Saved books</h2>
        {savedBooks.length === 0 ? (
          <p className="text-sm text-ink-muted">Nothing saved yet — bookmark books from the shelf.</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {savedBooks.map(({ book }) => (
              <BookCover key={book.id} book={book} isSaved currentUser={{ id: user.id, walletBalance: user.walletBalance }} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display mb-4 text-xl">Recent reward activity</h2>
        {rewardLogs.length === 0 ? (
          <p className="text-sm text-ink-muted">No reward activity yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {rewardLogs.map((log) => (
              <li key={log.id} className="flex justify-between rounded-lg border border-shelf-line bg-paper-raised px-4 py-2.5">
                <span>{log.action}</span>
                <span className="font-medium text-accent">+{log.points} pts</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
