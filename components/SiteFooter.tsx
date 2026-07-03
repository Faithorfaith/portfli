"use client";

import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname.endsWith("/read")) return null;

  return (
    <footer className="border-t border-black/5 py-10 text-center text-sm text-ink-muted">
      OpenShelf — a calm place to read, share, and be discovered.
    </footer>
  );
}
