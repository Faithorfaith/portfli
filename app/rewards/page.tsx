import Link from "next/link";
import { Award, Trophy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getLevel, nextLevel, badgesForContributor, POINT_VALUES } from "@/lib/rewards";

export default async function RewardsPage() {
  const user = await getCurrentUser();

  const [topUsers, approvedCounts, validReportCounts] = await Promise.all([
    prisma.user.findMany({ orderBy: { points: "desc" }, take: 20 }),
    prisma.book.groupBy({ by: ["submittedById"], where: { status: "APPROVED" }, _count: { _all: true } }),
    prisma.report.groupBy({ by: ["reportedById"], where: { status: "resolved" }, _count: { _all: true } }),
  ]);

  const approvedMap = new Map(approvedCounts.map((c) => [c.submittedById, c._count._all]));
  const validReportMap = new Map(validReportCounts.map((c) => [c.reportedById, c._count._all]));

  const me = user
    ? {
        ...user,
        approvedBooks: approvedMap.get(user.id) ?? 0,
        validReports: validReportMap.get(user.id) ?? 0,
      }
    : null;
  const myNext = me ? nextLevel(me.points) : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display mb-2 text-3xl">Rewards</h1>
      <p className="mb-8 text-ink-muted">Contribute useful, honest work to the shelf and earn recognition.</p>

      {me ? (
        <div className="mb-10 rounded-2xl border border-shelf-line bg-paper-raised p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs tracking-wide text-ink-muted uppercase">Your standing</p>
              <p className="font-display text-2xl">{getLevel(me.points)}</p>
              <p className="text-sm text-ink-muted">{me.points} points · {me.approvedBooks} approved uploads</p>
            </div>
            {myNext && (
              <div className="text-right text-sm text-ink-muted">
                {myNext.min - me.points} points to <strong className="text-ink">{myNext.name}</strong>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {badgesForContributor({
              points: me.points,
              isVerified: me.isVerified,
              approvedBooks: me.approvedBooks,
              validReports: me.validReports,
            }).map((badge) => (
              <span key={badge} className="inline-flex items-center gap-1 rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-xs text-wood-dark">
                <Award className="h-3.5 w-3.5" /> {badge}
              </span>
            ))}
            {me.approvedBooks === 0 && (
              <span className="text-xs text-ink-muted">Submit your first book to start earning badges.</span>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-10 rounded-2xl border border-dashed border-shelf-line p-6 text-center text-ink-muted">
          <Link href="/signin" className="text-accent underline">
            Sign in
          </Link>{" "}
          to see your points, badges, and level.
        </div>
      )}

      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        {[
          ["Approved book upload", POINT_VALUES.APPROVED_UPLOAD],
          ["Accurate metadata", POINT_VALUES.ACCURATE_METADATA],
          ["Helpful summary", POINT_VALUES.HELPFUL_SUMMARY],
          ["Valid report", POINT_VALUES.VALID_REPORT],
          ["Helpful guestbook note", POINT_VALUES.HELPFUL_GUESTBOOK_NOTE],
          ["Book reaches a read milestone", POINT_VALUES.READ_MILESTONE],
        ].map(([label, points]) => (
          <div key={label as string} className="flex items-center justify-between rounded-xl border border-shelf-line bg-paper-raised px-4 py-3 text-sm">
            <span>{label}</span>
            <span className="font-medium text-accent">+{points} pts</span>
          </div>
        ))}
      </div>

      <h2 className="font-display mb-4 flex items-center gap-2 text-xl">
        <Trophy className="h-5 w-5 text-gold" /> Contributor leaderboard
      </h2>
      <ol className="divide-y divide-shelf-line rounded-xl border border-shelf-line bg-paper-raised">
        {topUsers.map((u, i) => (
          <li key={u.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="w-5 text-ink-muted">{i + 1}</span>
              <span className="font-medium">{u.name}</span>
              {u.isVerified && <span className="text-xs text-verified">Verified</span>}
            </div>
            <div className="flex items-center gap-4 text-ink-muted">
              <span>{approvedMap.get(u.id) ?? 0} uploads</span>
              <span className="font-medium text-ink">{u.points} pts</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
