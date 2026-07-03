"use client";

import { ShieldCheck, Shield } from "lucide-react";
import { toggleVerified } from "@/lib/actions/admin";

type Contributor = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  points: number;
  approvedBooks: number;
};

export default function AdminContributorsList({ contributors }: { contributors: Contributor[] }) {
  return (
    <ul className="divide-y divide-shelf-line rounded-xl border border-shelf-line bg-paper-raised">
      {contributors.map((c) => (
        <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-medium">
              {c.name} {c.role === "ADMIN" && <span className="text-xs text-ink-muted">(admin)</span>}
            </p>
            <p className="text-xs text-ink-muted">
              {c.email} · {c.points} pts · {c.approvedBooks} approved uploads
            </p>
          </div>
          <button
            onClick={() => toggleVerified(c.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs ${
              c.isVerified ? "border-verified bg-verified/10 text-verified" : "border-shelf-line text-ink-muted"
            }`}
          >
            {c.isVerified ? <ShieldCheck className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
            {c.isVerified ? "Verified" : "Not verified"}
          </button>
        </li>
      ))}
    </ul>
  );
}
