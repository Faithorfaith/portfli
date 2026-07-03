"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Bookmark, Coins, Info } from "lucide-react";
import PlaceholderCover from "./PlaceholderCover";
import Badge from "./Badge";
import TipModal from "./TipModal";
import { toggleSave } from "@/lib/actions/books";
import { bookBadge, canReceiveTips } from "@/lib/book-helpers";

export type ShelfBook = {
  id: string;
  title: string;
  authorName: string;
  coverUrl: string | null;
  fileUrl: string | null;
  status: string;
  ownershipType: "WROTE" | "PERMISSION" | "PUBLIC_DOMAIN" | "FREE_LICENSED";
  tipEligible: boolean;
  submittedBy: { id: string; isVerified: boolean };
};

export default function BookCover({
  book,
  isSaved,
  currentUser,
}: {
  book: ShelfBook;
  isSaved: boolean;
  currentUser: { id: string; walletBalance: number } | null;
}) {
  const [tipOpen, setTipOpen] = useState(false);
  const badge = bookBadge(book);
  const tippable = canReceiveTips(book) && currentUser?.id !== book.submittedBy.id;

  return (
    <div className="group/cover relative w-[128px] shrink-0 select-none sm:w-[140px]">
      <div className="relative h-[184px] overflow-hidden rounded-md shadow-[0_6px_14px_rgba(60,45,25,0.18)] transition-all duration-300 group-hover/cover:-translate-y-2 group-hover/cover:shadow-[0_18px_30px_rgba(60,45,25,0.28)] sm:h-[200px]">
        <Link href={`/book/${book.id}`} className="absolute inset-0 block">
          {book.coverUrl ? (
            <Image src={book.coverUrl} alt={book.title} fill sizes="140px" className="object-cover" />
          ) : (
            <PlaceholderCover title={book.title} author={book.authorName} />
          )}
        </Link>
        <div className="pointer-events-none absolute top-1.5 left-1.5">
          <Badge label={badge} />
        </div>

        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/90 via-black/70 to-transparent px-2 pt-6 pb-2 opacity-0 transition-all duration-200 group-hover/cover:translate-y-0 group-hover/cover:opacity-100">
          <Link href={`/book/${book.id}`} className="line-clamp-2 text-[11px] font-medium text-white">
            {book.title}
          </Link>
          <div className="mt-1.5 flex items-center justify-between text-white/85">
            {book.status === "APPROVED" && book.fileUrl ? (
              <Link href={`/book/${book.id}/read`} title="Read" className="hover:text-white">
                <BookOpen className="h-4 w-4" />
              </Link>
            ) : (
              <span className="opacity-30">
                <BookOpen className="h-4 w-4" />
              </span>
            )}
            <form action={toggleSave.bind(null, book.id)}>
              <button title="Save" className={isSaved ? "text-gold" : "hover:text-white"}>
                <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
              </button>
            </form>
            {tippable ? (
              <button title="Tip" onClick={() => setTipOpen(true)} className="hover:text-gold">
                <Coins className="h-4 w-4" />
              </button>
            ) : (
              <span className="opacity-30">
                <Coins className="h-4 w-4" />
              </span>
            )}
            <Link href={`/book/${book.id}`} title="Details" className="hover:text-white">
              <Info className="h-4 w-4" />
            </Link>
          </div>
        </div>
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
    </div>
  );
}
