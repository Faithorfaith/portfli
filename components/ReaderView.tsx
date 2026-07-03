"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Coins, Flag } from "lucide-react";
import TipModal from "./TipModal";
import ReportModal from "./ReportModal";
import { toggleSave, recordRead } from "@/lib/actions/books";
import { canReceiveTips } from "@/lib/book-helpers";

type Book = {
  id: string;
  title: string;
  authorName: string;
  fileUrl: string;
  fileType: string | null;
  ownershipType: "WROTE" | "PERMISSION" | "PUBLIC_DOMAIN" | "FREE_LICENSED";
  tipEligible: boolean;
  status: string;
  submittedBy: { id: string; isVerified: boolean };
};

export default function ReaderView({
  book,
  isSaved,
  currentUser,
}: {
  book: Book;
  isSaved: boolean;
  currentUser: { id: string; walletBalance: number } | null;
}) {
  const counted = useRef(false);
  const [progress, setProgress] = useState(0);
  const [tipOpen, setTipOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const isEpub = book.fileType === ".epub" || book.fileUrl.endsWith(".epub");
  const tippable = canReceiveTips(book) && currentUser?.id !== book.submittedBy.id;
  const progressKey = `openshelf:progress:${book.id}`;

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;
    recordRead(book.id);
    const saved = Number(window.localStorage.getItem(progressKey) ?? 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of browser-only storage on mount
    if (!Number.isNaN(saved)) setProgress(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateProgress(value: number) {
    setProgress(value);
    window.localStorage.setItem(progressKey, String(value));
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-shelf-line px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link href={`/book/${book.id}`} className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Shelf
          </Link>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{book.title}</p>
            <p className="truncate text-xs text-ink-muted">{book.authorName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <form action={toggleSave.bind(null, book.id)}>
            <button
              title="Save"
              className={`rounded-full border p-2 ${isSaved ? "border-accent text-accent" : "border-shelf-line text-ink-muted hover:text-accent"}`}
            >
              <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
            </button>
          </form>
          {tippable && (
            <button onClick={() => setTipOpen(true)} title="Tip owner" className="rounded-full border border-gold/50 bg-gold/10 p-2 text-wood-dark hover:bg-gold/20">
              <Coins className="h-4 w-4" />
            </button>
          )}
          <button onClick={() => setReportOpen(true)} title="Report" className="rounded-full border border-shelf-line p-2 text-ink-muted hover:text-accent">
            <Flag className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-shelf-line bg-paper-raised px-4 py-2">
        <span className="text-xs text-ink-muted">Your progress</span>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => updateProgress(Number(e.target.value))}
          className="h-1.5 flex-1 accent-accent"
        />
        <span className="w-10 text-right text-xs text-ink-muted">{progress}%</span>
      </div>

      <div className="relative min-h-0 flex-1 bg-black/5">
        {isEpub ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-ink-muted">
              In-browser EPUB reading isn&apos;t available in this preview yet.
            </p>
            <a
              href={book.fileUrl}
              download
              className="rounded-full bg-accent px-5 py-2.5 text-paper-raised hover:bg-accent-hover"
            >
              Download EPUB to read
            </a>
          </div>
        ) : (
          <iframe src={book.fileUrl} title={book.title} className="absolute inset-0 h-full w-full" />
        )}
      </div>

      {tipOpen && (
        <TipModal
          bookId={book.id}
          bookTitle={book.title}
          authorName={book.authorName}
          walletBalance={currentUser?.walletBalance ?? 0}
          onClose={() => setTipOpen(false)}
        />
      )}
      {reportOpen && <ReportModal bookId={book.id} onClose={() => setReportOpen(false)} />}
    </div>
  );
}
