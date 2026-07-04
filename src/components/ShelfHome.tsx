"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ShelfDTO } from "@/lib/dto";
import { serif } from "@/lib/theme";
import { Bookcase } from "./Bookcase";
import { BookPreviewModal } from "./BookPreviewModal";
import { useToast } from "./ToastProvider";
import navStyles from "./TopNav.module.css";

export function ShelfHome({ shelves, showBadges }: { shelves: ShelfDTO[]; showBadges: boolean }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [previewId, setPreviewId] = useState<number | null>(() => {
    const openId = searchParams.get("open");
    return openId ? Number(openId) : null;
  });
  const { showToast } = useToast();

  useEffect(() => {
    // Strip the ?open= param used to arrive here (e.g. from the reader's
    // "Leave a note" link) once its initial value has been consumed above.
    if (searchParams.get("open")) router.replace("/", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayShelves = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return shelves;

    const matches = shelves.flatMap((shelf) =>
      shelf.books.filter(
        (book) =>
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.badge.toLowerCase().includes(q) ||
          shelf.label.toLowerCase().includes(q)
      )
    );

    const result: ShelfDTO = {
      id: "results",
      label: "Search results",
      description: `for “${query.trim()}”`,
      count: `${matches.length} book${matches.length === 1 ? "" : "s"}`,
      empty: matches.length === 0,
      books: matches,
    };
    return [result];
  }, [shelves, query]);

  return (
    <div style={{ animation: "osFadeUp .5s ease both" }}>
      <div className={navStyles.nav}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 26, minWidth: 0 }}>
          <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
            Open shelf
          </div>
        </div>
        <button
          className={navStyles.submitButton}
          onClick={() => showToast("The submit-for-review flow is coming in the next iteration.")}
        >
          Submit a book
        </button>
      </div>

      <div style={{ padding: "150px 24px 0", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: serif,
            fontWeight: 420,
            fontSize: "clamp(34px,5vw,52px)",
            lineHeight: 1.08,
            margin: "0 auto",
            maxWidth: 640,
            letterSpacing: "-0.01em",
          }}
        >
          A calm shelf of books, free to read.
        </h1>
        <p style={{ fontSize: 15, color: "#8A8276", maxWidth: 440, margin: "16px auto 0", lineHeight: 1.6 }}>
          Every book here was submitted by a reader and reviewed before it earned its place on the shelf.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "34px 24px 0" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books, authors, shelves…"
          className={navStyles.searchInput}
        />
      </div>

      <div style={{ width: "min(1120px,100%)", margin: "0 auto", padding: "80px 24px 110px" }}>
        <Bookcase shelves={displayShelves} onOpenBook={setPreviewId} />
      </div>

      <div style={{ textAlign: "center", padding: "0 24px 70px", fontSize: 12.5, color: "#A39B8D" }}>
        Reviewed by librarians · Free to read · OpenShelf ·{" "}
        <Link href="/settings" style={{ color: "inherit" }}>
          Settings
        </Link>
      </div>

      {previewId != null ? (
        <BookPreviewModal key={previewId} bookId={previewId} showBadge={showBadges} onClose={() => setPreviewId(null)} />
      ) : null}
    </div>
  );
}
