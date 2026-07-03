"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/actions/auth";

type NavUser = {
  id: string;
  name: string;
  role: string;
} | null;

const NAV_ITEMS = [
  { href: "/", label: "Shelf" },
  { href: "/search", label: "Search" },
  { href: "/submit", label: "Submit" },
  { href: "/rewards", label: "Rewards" },
];

export default function TopNav({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.endsWith("/read")) return null;

  return (
    <div className="sticky top-4 z-40 mx-auto w-full max-w-6xl px-4">
      <nav className="flex items-center justify-between rounded-full border border-shelf-line/70 bg-paper-raised/90 px-5 py-3 shadow-[0_8px_30px_rgba(90,70,40,0.08)] backdrop-blur">
        <Link href="/" className="font-display text-lg tracking-tight text-ink">
          Open<span className="text-accent">Shelf</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active ? "bg-accent text-paper-raised" : "text-ink-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className={`rounded-full px-4 py-2 text-sm transition ${
                pathname.startsWith("/admin") ? "bg-accent text-paper-raised" : "text-ink-muted hover:text-ink"
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-shelf-line bg-paper px-3 py-1.5 text-sm"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-wood text-xs text-paper-raised">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-[100px] truncate sm:inline">{user.name}</span>
              </button>
              {open && (
                <div
                  className="absolute right-0 top-12 w-44 rounded-xl border border-shelf-line bg-paper-raised p-1.5 shadow-lg"
                  onMouseLeave={() => setOpen(false)}
                >
                  <Link
                    href="/profile"
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-paper"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <form action={signOut}>
                    <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-accent hover:bg-paper">
                      Sign out
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/signin"
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-paper-raised hover:bg-accent-hover"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
      <div className="mt-2 flex justify-center gap-1 md:hidden">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full px-3 py-1.5 text-xs text-ink-muted hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
