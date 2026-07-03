import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/format";

export default async function AdminOverviewPage() {
  const [pending, approved, rejected, openReports, contributors, tipAgg] = await Promise.all([
    prisma.book.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.book.count({ where: { status: "APPROVED" } }),
    prisma.book.count({ where: { status: "REJECTED" } }),
    prisma.report.count({ where: { status: "open" } }),
    prisma.user.count(),
    prisma.tip.aggregate({ _sum: { amount: true }, _count: true }),
  ]);

  const cards = [
    { label: "Pending review", value: pending, href: "/admin/pending" },
    { label: "Approved books", value: approved, href: "/admin/approved" },
    { label: "Rejected books", value: rejected, href: "/admin/rejected" },
    { label: "Open reports", value: openReports, href: "/admin/reports" },
    { label: "Contributors", value: contributors, href: "/admin/contributors" },
    { label: "Tips sent", value: `${formatNaira(tipAgg._sum.amount ?? 0)} (${tipAgg._count})`, href: "/admin/tips" },
  ];

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-shelf-line bg-paper-raised p-5 transition hover:border-accent"
          >
            <p className="text-xs tracking-wide text-ink-muted uppercase">{card.label}</p>
            <p className="font-display mt-1 text-3xl">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
