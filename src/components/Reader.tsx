"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import type { BigCoverDTO } from "@/lib/dto";
import { reportBook, tipAuthor, toggleBookmark } from "@/app/actions";
import { useToast } from "./ToastProvider";
import buttons from "./buttons.module.css";
import styles from "./Reader.module.css";

export function Reader({
  book,
  pages,
  initialBookmarkedSpreads,
}: {
  book: BigCoverDTO;
  pages: string[];
  initialBookmarkedSpreads: number[];
}) {
  const [spread, setSpread] = useState(0);
  const [flip, setFlip] = useState(false);
  const [flipText, setFlipText] = useState("");
  const [bookmarkedSpreads, setBookmarkedSpreads] = useState(() => new Set(initialBookmarkedSpreads));
  const { showToast } = useToast();
  const [, startTransition] = useTransition();

  const maxSpread = Math.ceil(pages.length / 2);
  const finished = spread >= maxSpread;
  const li = spread * 2;
  const leftText = pages[li] || "";
  const rightText = pages[li + 1] || "";

  function next() {
    if (flip || spread >= maxSpread) return;
    if (spread === maxSpread - 1) {
      setSpread(maxSpread);
      return;
    }
    setFlipText(pages[spread * 2 + 1] || "");
    setFlip(true);
    setSpread((s) => s + 1);
    setTimeout(() => setFlip(false), 560);
  }

  function prev() {
    if (!flip && spread > 0) setSpread((s) => s - 1);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flip, spread]);

  const bookmarked = bookmarkedSpreads.has(spread);

  function toggleBookmarkClick() {
    const willBeMarked = !bookmarked;
    setBookmarkedSpreads((prev) => {
      const next = new Set(prev);
      if (willBeMarked) next.add(spread);
      else next.delete(spread);
      return next;
    });
    startTransition(async () => {
      await toggleBookmark(book.id, spread);
    });
  }

  function tipClick() {
    startTransition(async () => {
      await tipAuthor(book.id);
    });
    showToast("Tip sent to the author — thank you.");
  }

  function reportClick() {
    startTransition(async () => {
      await reportBook(book.id);
    });
    showToast("Reported. A librarian will take a look.");
  }

  const pageLabel = finished
    ? "Finished"
    : `Page ${li + 1}–${Math.min(li + 2, pages.length)} of ${pages.length}`;
  const progressPct = finished ? 100 : Math.round((Math.min(li + 2, pages.length) / pages.length) * 100);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back to the shelf
        </Link>
        <div className={styles.headerRight}>
          <span>{pageLabel}</span>
          <button
            className={styles.bookmarkToggle}
            style={{ color: bookmarked ? "#1C1915" : "#6E675C" }}
            onClick={toggleBookmarkClick}
          >
            {bookmarked ? "Bookmarked ✓" : "Bookmark this page"}
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <button className={styles.arrow} style={{ opacity: spread > 0 ? 1 : 0.35 }} onClick={prev}>
          ‹
        </button>

        {!finished ? (
          <div className={styles.spreadWrap}>
            <div className={styles.spreadInner}>
              <div className={styles.leftPage}>
                {spread === 0 ? (
                  <>
                    <div className={styles.chapterLabel}>Chapter one</div>
                    <div className={styles.chapterTitle}>{book.title}</div>
                  </>
                ) : null}
                <div className={styles.pageText}>{leftText}</div>
                <div className={styles.pageNum}>{li + 1}</div>
              </div>
              <div className={styles.rightPage} onClick={next}>
                <div className={styles.pageText}>{rightText}</div>
                <div className={styles.pageNum}>{li + 2}</div>
              </div>
            </div>
            {flip ? (
              <div className={styles.flipPage}>
                <div className={styles.pageText}>{flipText}</div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className={styles.backCover}>
            <div
              className={styles.backCoverCard}
              style={{ background: book.bg, color: book.ink }}
            >
              <div className={styles.backCoverSpine} />
              <div className={styles.backCoverFrame} style={{ opacity: book.frameOpacity }} />
              <div className={styles.theEnd}>The end</div>
              <div className={styles.rule} />
              <div className={styles.backCoverDesc}>{book.description}</div>
              <div className={styles.backCoverByline}>{book.author} · OpenShelf</div>
            </div>
            <div className={styles.backCoverActions}>
              <Link href="/" className={buttons.dark}>
                Back to the shelf
              </Link>
              <Link href={`/?open=${book.id}`} className={buttons.outline}>
                Leave a note
              </Link>
              {book.tip ? (
                <button className={buttons.outline} onClick={tipClick}>
                  Tip the author
                </button>
              ) : null}
            </div>
          </div>
        )}

        <button className={styles.arrow} style={{ opacity: spread < maxSpread ? 1 : 0.35 }} onClick={next}>
          ›
        </button>
      </div>

      <div className={styles.footer}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
        </div>
        <div className={styles.footerLinks}>
          <Link href={`/?open=${book.id}`} className={styles.footerLink}>
            Leave a note
          </Link>
          {book.tip ? (
            <button className={styles.footerLink} onClick={tipClick}>
              Tip the author
            </button>
          ) : null}
          <button className={styles.footerLink} onClick={reportClick}>
            Report
          </button>
        </div>
      </div>
    </div>
  );
}
