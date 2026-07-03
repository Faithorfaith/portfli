"use client";

import Link from "next/link";
import { resolveReport } from "@/lib/actions/admin";
import { timeAgo } from "@/lib/format";

type Report = {
  id: string;
  targetType: string;
  reason: string;
  status: string;
  createdAt: Date;
  reportedBy: { name: string };
  book: { id: string; title: string } | null;
};

export default function AdminReportsList({ reports }: { reports: Report[] }) {
  return (
    <ul className="space-y-3">
      {reports.map((report) => (
        <li key={report.id} className="rounded-xl border border-shelf-line bg-paper-raised p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs tracking-wide text-ink-muted uppercase">
                {report.targetType === "book" ? "Book report" : "Guestbook report"} · {timeAgo(report.createdAt)}
              </p>
              {report.book && (
                <Link href={`/book/${report.book.id}`} className="font-medium hover:text-accent">
                  {report.book.title}
                </Link>
              )}
              <p className="mt-1 text-sm">{report.reason}</p>
              <p className="mt-1 text-xs text-ink-muted">Reported by {report.reportedBy.name}</p>
            </div>
            {report.status === "open" ? (
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => resolveReport(report.id, "valid")}
                  className="rounded-full bg-verified/10 px-3 py-1.5 text-xs text-verified hover:bg-verified/20"
                >
                  Mark valid (+20 pts)
                </button>
                <button
                  onClick={() => resolveReport(report.id, "dismissed")}
                  className="rounded-full bg-black/5 px-3 py-1.5 text-xs text-ink-muted hover:bg-black/10"
                >
                  Dismiss
                </button>
              </div>
            ) : (
              <span className="shrink-0 rounded-full bg-black/5 px-3 py-1 text-xs text-ink-muted capitalize">
                {report.status}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
