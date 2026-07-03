"use client";

import Link from "next/link";
import { Coins, Trash2 } from "lucide-react";
import { toggleTipEligible, removeBook } from "@/lib/actions/admin";
import { formatNaira } from "@/lib/format";

type Book = {
  id: string;
  title: string;
  authorName: string;
  tipEligible: boolean;
  reads: number;
  saveCount: number;
  shelf: { name: string };
  submittedBy: { name: string; isVerified: boolean };
  tips: { amount: number }[];
};

export default function AdminApprovedList({ books }: { books: Book[] }) {
  return (
    <ul className="divide-y divide-shelf-line rounded-xl border border-shelf-line bg-paper-raised">
      {books.map((book) => {
        const tipped = book.tips.reduce((sum, t) => sum + t.amount, 0);
        return (
          <li key={book.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <Link href={`/book/${book.id}`} className="font-medium hover:text-accent">
                {book.title}
              </Link>
              <p className="text-xs text-ink-muted">
                {book.authorName} · {book.shelf.name} · {book.reads} reads · {book.saveCount} saves ·{" "}
                {formatNaira(tipped)} tipped
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleTipEligible(book.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs ${
                  book.tipEligible ? "border-gold bg-gold/10 text-wood-dark" : "border-shelf-line text-ink-muted"
                }`}
              >
                <Coins className="h-3.5 w-3.5" /> {book.tipEligible ? "Tip-eligible" : "Not tip-eligible"}
              </button>
              <button
                onClick={() => {
                  if (confirm(`Remove "${book.title}" from the shelf?`)) removeBook(book.id);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-shelf-line px-3 py-1.5 text-xs text-ink-muted hover:border-accent hover:text-accent"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
