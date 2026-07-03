import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/format";
import { timeAgo } from "@/lib/format";
import { PLATFORM_COMMISSION, MIN_PAYOUT_THRESHOLD } from "@/lib/book-helpers";

export default async function TipsWalletPage() {
  const [tips, payoutReady] = await Promise.all([
    prisma.tip.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { book: true, fromUser: true, toUser: true },
    }),
    prisma.user.findMany({ where: { earnings: { gte: MIN_PAYOUT_THRESHOLD } }, orderBy: { earnings: "desc" } }),
  ]);

  const gross = tips.reduce((sum, t) => sum + t.amount, 0);
  const commission = Math.round(gross * PLATFORM_COMMISSION);

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl">Tips / Wallet</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-shelf-line bg-paper-raised p-4">
          <p className="text-xs text-ink-muted uppercase">Gross tips (last 50)</p>
          <p className="font-display text-2xl">{formatNaira(gross)}</p>
        </div>
        <div className="rounded-xl border border-shelf-line bg-paper-raised p-4">
          <p className="text-xs text-ink-muted uppercase">Platform commission ({PLATFORM_COMMISSION * 100}%)</p>
          <p className="font-display text-2xl">{formatNaira(commission)}</p>
        </div>
        <div className="rounded-xl border border-shelf-line bg-paper-raised p-4">
          <p className="text-xs text-ink-muted uppercase">Ready for payout ({formatNaira(MIN_PAYOUT_THRESHOLD)}+)</p>
          <p className="font-display text-2xl">{payoutReady.length} authors</p>
        </div>
      </div>

      {payoutReady.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display mb-3 text-lg">Payout queue</h2>
          <ul className="divide-y divide-shelf-line rounded-xl border border-shelf-line bg-paper-raised">
            {payoutReady.map((u) => (
              <li key={u.id} className="flex justify-between px-4 py-2.5 text-sm">
                <span>{u.name}</span>
                <span className="font-medium">{formatNaira(u.earnings)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="font-display mb-3 text-lg">Recent tips</h2>
      {tips.length === 0 ? (
        <p className="text-ink-muted">No tips yet.</p>
      ) : (
        <ul className="divide-y divide-shelf-line rounded-xl border border-shelf-line bg-paper-raised">
          {tips.map((tip) => (
            <li key={tip.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <span>
                {tip.fromUser.name} tipped {tip.toUser.name} for &ldquo;{tip.book.title}&rdquo;
              </span>
              <span className="text-ink-muted">
                {formatNaira(tip.amount)} · {timeAgo(tip.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
