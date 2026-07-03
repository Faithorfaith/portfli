"use client";

import { useActionState, useState } from "react";
import { X, Coins } from "lucide-react";
import { tipBook } from "@/lib/actions/books";
import { formatNaira } from "@/lib/format";
import { TIP_PRESETS } from "@/lib/book-helpers";

export default function TipModal({
  bookId,
  bookTitle,
  authorName,
  walletBalance,
  onClose,
}: {
  bookId: string;
  bookTitle: string;
  authorName: string;
  walletBalance: number;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(tipBook, {});
  const [amount, setAmount] = useState(200);
  const [custom, setCustom] = useState("");

  if (state.success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
        <div className="w-full max-w-sm rounded-2xl bg-paper-raised p-6 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
          <Coins className="mx-auto mb-3 h-8 w-8 text-gold" />
          <h3 className="font-display text-xl">Tip sent!</h3>
          <p className="mt-2 text-sm text-ink-muted">
            {authorName} just received your support (simulated demo wallet — no real payment was processed).
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
          <div>
            <h3 className="font-display text-lg">Tip {authorName}</h3>
            <p className="text-xs text-ink-muted">for &ldquo;{bookTitle}&rdquo;</p>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="bookId" value={bookId} />
          <input type="hidden" name="amount" value={custom ? Number(custom) : amount} />

          <div className="grid grid-cols-4 gap-2">
            {TIP_PRESETS.map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => {
                  setAmount(preset);
                  setCustom("");
                }}
                className={`rounded-lg border py-2 text-sm transition ${
                  !custom && amount === preset
                    ? "border-accent bg-accent text-paper-raised"
                    : "border-shelf-line hover:border-accent"
                }`}
              >
                {formatNaira(preset)}
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-xs text-ink-muted">Or enter a custom amount</label>
            <input
              type="number"
              min={50}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="₦"
              className="w-full rounded-lg border border-shelf-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>

          <p className="text-xs text-ink-muted">
            Demo wallet balance: {formatNaira(walletBalance)}. A small platform commission applies before
            payout to the author.
          </p>

          {state.error && <p className="text-sm text-accent">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-accent py-2.5 font-medium text-paper-raised hover:bg-accent-hover disabled:opacity-60"
          >
            {pending ? "Sending…" : `Send ${formatNaira(custom ? Number(custom) || 0 : amount)} tip`}
          </button>
        </form>
      </div>
    </div>
  );
}
