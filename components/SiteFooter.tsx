"use client";

import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname.endsWith("/read") || pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-shelf-line py-10 text-center text-sm text-ink-muted">
      Open shelf — a calm place to read, share, and be discovered.
    </footer>
  );
}
