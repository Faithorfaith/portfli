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
  { href: "/rewards", label: "Rewards" },
];

export default function TopNav({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.endsWith("/read") || pathname.startsWith("/admin")) return null;

  return (
    <header className="mx-auto w-full max-w-6xl px-6 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-lg tracking-tight text-ink">
          Open shelf
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition ${active ? "font-medium text-ink" : "text-ink-muted hover:text-ink"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-shelf-line px-3 py-1.5 text-sm"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs text-paper-raised">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-[100px] truncate sm:inline">{user.name}</span>
              </button>
              {open && (
                <div
                  className="absolute right-0 top-12 z-10 w-44 rounded-xl border border-shelf-line bg-paper-raised p-1.5 shadow-lg"
                  onMouseLeave={() => setOpen(false)}
                >
                  <Link
                    href="/profile"
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-paper"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-paper"
                      onClick={() => setOpen(false)}
                    >
                      Admin dashboard
                    </Link>
                  )}
                  <form action={signOut}>
                    <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-ink-muted hover:bg-paper">
                      Sign out
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <Link href="/signin" className="text-sm text-ink-muted hover:text-ink">
              Sign in
            </Link>
          )}

          <Link
            href="/submit"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper-raised transition hover:bg-accent-hover"
          >
            Submit a book
          </Link>
        </div>
      </div>

      <nav className="mt-4 flex justify-center gap-4 md:hidden">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="text-xs text-ink-muted hover:text-ink">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
