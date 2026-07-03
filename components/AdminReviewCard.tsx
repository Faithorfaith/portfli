"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { approveBook, rejectBook, requestChanges } from "@/lib/actions/admin";
import { OWNERSHIP_LABEL } from "@/lib/format";

type Book = {
  id: string;
  title: string;
  authorName: string;
  description: string;
  language: string;
  fileUrl: string | null;
  coverUrl: string | null;
  ownershipType: string;
  reviewNote: string | null;
  shelf: { name: string };
  submittedBy: { name: string; email: string; isVerified: boolean };
};

export default function AdminReviewCard({ book }: { book: Book }) {
  const [mode, setMode] = useState<"none" | "approve" | "reject" | "changes">("none");
  const [preview, setPreview] = useState(false);
  const [approveState, approveAction, approvePending] = useActionState(approveBook, {});
  const [rejectState, rejectAction, rejectPending] = useActionState(rejectBook, {});
  const [changesState, changesAction, changesPending] = useActionState(requestChanges, {});

  return (
    <div className="rounded-xl border border-shelf-line bg-paper-raised p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href={`/book/${book.id}`} className="font-display text-lg hover:text-accent">
            {book.title}
          </Link>
          <p className="text-sm text-ink-muted">
            by {book.authorName} · {book.shelf.name} · {book.language}
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            Submitted by {book.submittedBy.name} ({book.submittedBy.email})
            {book.submittedBy.isVerified && <span className="text-verified"> · already verified</span>}
          </p>
          <p className="mt-1 text-xs font-medium">
            Ownership claim: {OWNERSHIP_LABEL[book.ownershipType]}
          </p>
        </div>
        {book.fileUrl && (
          <button
            onClick={() => setPreview((v) => !v)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-shelf-line px-3 py-1.5 text-xs hover:border-accent"
          >
            <Eye className="h-3.5 w-3.5" /> {preview ? "Hide preview" : "Preview file"}
          </button>
        )}
      </div>

      <p className="mt-3 text-sm text-ink-muted">{book.description}</p>

      {preview && book.fileUrl && (
        <iframe src={book.fileUrl} title={book.title} className="mt-3 h-96 w-full rounded-lg border border-shelf-line" />
      )}

      {book.reviewNote && (
        <p className="mt-3 rounded-lg bg-black/5 px-3 py-2 text-xs text-ink-muted">Last note: {book.reviewNote}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setMode(mode === "approve" ? "none" : "approve")}
          className="inline-flex items-center gap-1.5 rounded-full bg-verified/10 px-3 py-1.5 text-sm text-verified hover:bg-verified/20"
        >
          <CheckCircle2 className="h-4 w-4" /> Approve
        </button>
        <button
          onClick={() => setMode(mode === "changes" ? "none" : "changes")}
          className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1.5 text-sm text-wood-dark hover:bg-gold/20"
        >
          <RotateCcw className="h-4 w-4" /> Request changes
        </button>
        <button
          onClick={() => setMode(mode === "reject" ? "none" : "reject")}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-sm text-accent hover:bg-accent/20"
        >
          <XCircle className="h-4 w-4" /> Reject
        </button>
      </div>

      {mode === "approve" && (
        <form action={approveAction} className="mt-4 space-y-2 rounded-lg border border-verified/30 bg-verified/5 p-4">
          <input type="hidden" name="bookId" value={book.id} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="verifyOwner" defaultChecked={!book.submittedBy.isVerified} /> Verify ownership claim
            (marks contributor as a verified author)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="tipEligible" defaultChecked /> Mark tip-eligible
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="accurateMetadata" /> Bonus: accurate metadata (+10 pts)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="helpfulSummary" /> Bonus: helpful summary (+10 pts)
          </label>
          {approveState.error && <p className="text-sm text-accent">{approveState.error}</p>}
          <button disabled={approvePending} className="rounded-full bg-verified px-4 py-1.5 text-sm text-paper-raised disabled:opacity-60">
            {approvePending ? "Approving…" : "Confirm approval"}
          </button>
        </form>
      )}

      {mode === "changes" && (
        <form action={changesAction} className="mt-4 space-y-2 rounded-lg border border-gold/30 bg-gold/5 p-4">
          <input type="hidden" name="bookId" value={book.id} />
          <textarea
            name="note"
            required
            rows={3}
            placeholder="What should the contributor fix?"
            className="w-full rounded-lg border border-shelf-line bg-paper px-3 py-2 text-sm outline-none"
          />
          {changesState.error && <p className="text-sm text-accent">{changesState.error}</p>}
          <button disabled={changesPending} className="rounded-full bg-gold px-4 py-1.5 text-sm text-paper-raised disabled:opacity-60">
            {changesPending ? "Sending…" : "Send back for changes"}
          </button>
        </form>
      )}

      {mode === "reject" && (
        <form action={rejectAction} className="mt-4 space-y-2 rounded-lg border border-accent/30 bg-accent/5 p-4">
          <input type="hidden" name="bookId" value={book.id} />
          <textarea
            name="note"
            required
            rows={3}
            placeholder="Why can't this book be published?"
            className="w-full rounded-lg border border-shelf-line bg-paper px-3 py-2 text-sm outline-none"
          />
          {rejectState.error && <p className="text-sm text-accent">{rejectState.error}</p>}
          <button disabled={rejectPending} className="rounded-full bg-accent px-4 py-1.5 text-sm text-paper-raised disabled:opacity-60">
            {rejectPending ? "Rejecting…" : "Confirm rejection"}
          </button>
        </form>
      )}
    </div>
  );
}
