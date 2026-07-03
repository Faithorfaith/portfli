"use client";

import { useActionState } from "react";
import { Flag, X } from "lucide-react";
import { reportBook } from "@/lib/actions/books";

export default function ReportModal({ bookId, onClose }: { bookId: string; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(reportBook, {});

  if (state.success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
        <div className="w-full max-w-sm rounded-2xl bg-paper-raised p-6 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
          <Flag className="mx-auto mb-3 h-7 w-7 text-accent" />
          <h3 className="font-display text-lg">Report received</h3>
          <p className="mt-2 text-sm text-ink-muted">
            Thanks for helping keep the shelf trustworthy. Our reviewers will take a look.
          </p>
          <button onClick={onClose} className="mt-5 w-full rounded-lg bg-accent py-2 text-paper-raised">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-paper-raised p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <h3 className="font-display text-lg">Report this book</h3>
          <button onClick={onClose} className="text-ink-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="bookId" value={bookId} />
          <textarea
            name="reason"
            required
            rows={4}
            placeholder="What's wrong with this book? (copyright, wrong ownership claim, inappropriate content…)"
            className="w-full rounded-lg border border-shelf-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {state.error && <p className="text-sm text-accent">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-accent py-2.5 font-medium text-paper-raised hover:bg-accent-hover disabled:opacity-60"
          >
            {pending ? "Sending…" : "Submit report"}
          </button>
        </form>
      </div>
    </div>
  );
}
