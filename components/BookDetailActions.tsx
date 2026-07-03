"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Bookmark, Coins, Flag } from "lucide-react";
import TipModal from "./TipModal";
import ReportModal from "./ReportModal";
import { toggleSave } from "@/lib/actions/books";
import { canReceiveTips } from "@/lib/book-helpers";

type Book = {
  id: string;
  title: string;
  authorName: string;
  fileUrl: string | null;
  status: string;
  ownershipType: "WROTE" | "PERMISSION" | "PUBLIC_DOMAIN" | "FREE_LICENSED";
  tipEligible: boolean;
  submittedBy: { id: string; isVerified: boolean };
};

export default function BookDetailActions({
  book,
  isSaved,
  currentUser,
}: {
  book: Book;
  isSaved: boolean;
  currentUser: { id: string; walletBalance: number } | null;
}) {
  const [tipOpen, setTipOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const tippable = canReceiveTips(book) && currentUser?.id !== book.submittedBy.id;
  const readable = book.status === "APPROVED" && book.fileUrl;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {readable ? (
        <Link
          href={`/book/${book.id}/read`}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-medium text-paper-raised hover:bg-accent-hover"
        >
          <BookOpen className="h-4 w-4" /> Read Book
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 rounded-full bg-black/10 px-5 py-2.5 font-medium text-ink-muted">
          <BookOpen className="h-4 w-4" /> Not available yet
        </span>
      )}

      <form action={toggleSave.bind(null, book.id)}>
        <button
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${
            isSaved ? "border-accent text-accent" : "border-shelf-line hover:border-accent"
          }`}
        >
          <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
          {isSaved ? "Saved" : "Save"}
        </button>
      </form>

      {tippable && (
        <button
          onClick={() => setTipOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-4 py-2.5 text-sm text-wood-dark hover:bg-gold/20"
        >
          <Coins className="h-4 w-4" /> Tip Owner
        </button>
      )}

      <button
        onClick={() => setReportOpen(true)}
        className="inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-sm text-ink-muted hover:text-accent"
      >
        <Flag className="h-4 w-4" /> Report
      </button>

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
