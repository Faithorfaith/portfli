import AdminContributorsList from "@/components/AdminContributorsList";
import { prisma } from "@/lib/prisma";

export default async function ContributorsPage() {
  const [users, approvedCounts] = await Promise.all([
    prisma.user.findMany({ orderBy: { points: "desc" } }),
    prisma.book.groupBy({ by: ["submittedById"], where: { status: "APPROVED" }, _count: { _all: true } }),
  ]);
  const approvedMap = new Map(approvedCounts.map((c) => [c.submittedById, c._count._all]));

  const contributors = users.map((u) => ({ ...u, approvedBooks: approvedMap.get(u.id) ?? 0 }));

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl">Contributors ({contributors.length})</h1>
      <AdminContributorsList contributors={contributors} />
    </div>
  );
}
