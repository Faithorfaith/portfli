"use client";

import { useActionState } from "react";
import { Flag, ThumbsUp } from "lucide-react";
import { postGuestbookEntry, markHelpful, reportGuestbookEntry } from "@/lib/actions/guestbook";
import { timeAgo } from "@/lib/format";

type Entry = {
  id: string;
  note: string;
  type: string;
  helpfulCount: number;
  reported: boolean;
  createdAt: Date;
  user: { name: string };
};

const TYPE_LABEL: Record<string, string> = {
  note: "Note",
  quote: "Favourite quote",
  reaction: "Reaction",
};

export default function GuestbookSection({
  bookId,
  entries,
  canPost,
}: {
  bookId: string;
  entries: Entry[];
  canPost: boolean;
}) {
  const [state, formAction, pending] = useActionState(postGuestbookEntry, {});

  return (
    <div>
      {canPost ? (
        <form action={formAction} className="mb-8 rounded-xl border border-shelf-line bg-paper-raised p-4">
          <input type="hidden" name="bookId" value={bookId} />
          <div className="mb-2 flex gap-2 text-xs">
            {Object.entries(TYPE_LABEL).map(([value, label]) => (
              <label key={value} className="inline-flex items-center gap-1 rounded-full border border-shelf-line px-2.5 py-1 has-checked:border-accent has-checked:text-accent">
                <input type="radio" name="type" value={value} defaultChecked={value === "note"} className="hidden" />
                {label}
              </label>
            ))}
          </div>
          <textarea
            name="note"
            required
            maxLength={500}
            rows={3}
            placeholder="Leave a note, a favourite quote, or a reaction for other readers…"
            className="w-full rounded-lg border border-shelf-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {state.error && <p className="mt-1 text-sm text-accent">{state.error}</p>}
          <div className="mt-2 flex justify-end">
            <button
              disabled={pending}
              className="rounded-full bg-accent px-4 py-1.5 text-sm text-paper-raised hover:bg-accent-hover disabled:opacity-60"
            >
              {pending ? "Posting…" : "Post to guestbook"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mb-8 text-sm text-ink-muted">
          <a href="/signin" className="text-accent underline">
            Sign in
          </a>{" "}
          to leave a note in the guestbook.
        </p>
      )}

      {entries.length === 0 ? (
        <p className="text-sm text-ink-muted">No guestbook notes yet — be the first to leave one.</p>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-xl border border-shelf-line bg-paper-raised p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium">{entry.user.name}</span>
                <span className="text-xs text-ink-muted">{timeAgo(entry.createdAt)}</span>
              </div>
              <p className="mb-1 text-[10px] tracking-wide text-ink-muted uppercase">{TYPE_LABEL[entry.type] ?? "Note"}</p>
              <p className="text-sm">{entry.type === "quote" ? `“${entry.note}”` : entry.note}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-ink-muted">
                <button
                  onClick={() => markHelpful(entry.id, bookId)}
                  className="inline-flex items-center gap-1 hover:text-accent"
                >
                  <ThumbsUp className="h-3.5 w-3.5" /> Helpful ({entry.helpfulCount})
                </button>
                <button
                  onClick={() => reportGuestbookEntry(entry.id, bookId)}
                  disabled={entry.reported}
                  className="inline-flex items-center gap-1 hover:text-accent disabled:opacity-40"
                >
                  <Flag className="h-3.5 w-3.5" /> {entry.reported ? "Reported" : "Report"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
