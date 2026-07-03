import AdminReportsList from "@/components/AdminReportsList";
import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { reportedBy: true, book: true },
  });

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl">Reports ({reports.filter((r) => r.status === "open").length} open)</h1>
      {reports.length === 0 ? (
        <p className="text-ink-muted">No reports filed.</p>
      ) : (
        <AdminReportsList reports={reports} />
      )}
    </div>
  );
}
