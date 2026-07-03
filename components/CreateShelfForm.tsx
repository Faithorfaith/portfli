"use client";

import { useActionState } from "react";
import { createShelf } from "@/lib/actions/admin";

export default function CreateShelfForm() {
  const [state, formAction, pending] = useActionState(createShelf, {});

  return (
    <form action={formAction} className="max-w-md space-y-3 rounded-xl border border-shelf-line bg-paper-raised p-5">
      <h2 className="font-display text-lg">New shelf</h2>
      <input
        name="name"
        required
        placeholder="Shelf name"
        className="w-full rounded-lg border border-shelf-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <textarea
        name="description"
        rows={2}
        placeholder="Short description"
        className="w-full rounded-lg border border-shelf-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
      />
      {state.error && <p className="text-sm text-accent">{state.error}</p>}
      {state.success && <p className="text-sm text-verified">Shelf created.</p>}
      <button disabled={pending} className="rounded-full bg-accent px-4 py-1.5 text-sm text-paper-raised disabled:opacity-60">
        {pending ? "Creating…" : "Create shelf"}
      </button>
    </form>
  );
}
