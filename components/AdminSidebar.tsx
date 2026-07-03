"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  Users,
  Coins,
  Layers,
  Settings,
} from "lucide-react";

const ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/pending", label: "Pending Books", icon: Clock },
  { href: "/admin/approved", label: "Approved Books", icon: CheckCircle },
  { href: "/admin/rejected", label: "Rejected Books", icon: XCircle },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/contributors", label: "Contributors", icon: Users },
  { href: "/admin/tips", label: "Tips / Wallet", icon: Coins },
  { href: "/admin/shelves", label: "Shelves / Categories", icon: Layers },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0 space-y-1 border-r border-shelf-line pr-4">
      {ITEMS.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
              active ? "bg-accent text-paper-raised" : "text-ink-muted hover:bg-paper-raised hover:text-ink"
            }`}
          >
            <Icon className="h-4 w-4" /> {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
