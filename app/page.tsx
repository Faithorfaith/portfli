import Link from "next/link";
import { Search } from "lucide-react";
import ShelfRow from "@/components/ShelfRow";
import { getHomeShelves, getSavedBookIds } from "@/lib/shelves";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  const [shelves, savedIds] = await Promise.all([getHomeShelves(), getSavedBookIds(user?.id ?? null)]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-6">
      <section className="mb-10 text-center">
        <p className="mb-3 text-xs tracking-[0.25em] text-ink-muted uppercase">A calm place to read</p>
        <h1 className="font-display mx-auto max-w-2xl text-4xl leading-tight sm:text-5xl">
          Every book here earned its place on the shelf.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-muted">
          Read approved books for free, submit your own work for review, earn recognition as a
          contributor, and support verified authors directly.
        </p>

        <form action="/search" className="mx-auto mt-7 flex max-w-lg items-center gap-2 rounded-full border border-shelf-line bg-paper-raised px-4 py-2.5 shadow-sm">
          <Search className="h-4 w-4 text-ink-muted" />
          <input
            name="q"
            placeholder="Search books, authors, or categories…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-muted"
          />
          <button className="shrink-0 rounded-full bg-accent px-4 py-1.5 text-sm text-paper-raised hover:bg-accent-hover">
            Search
          </button>
        </form>

        <div className="mt-5 flex justify-center gap-3 text-sm">
          <Link href="/submit" className="rounded-full border border-shelf-line px-4 py-1.5 hover:border-accent hover:text-accent">
            Submit a book
          </Link>
          <Link href="/rewards" className="rounded-full border border-shelf-line px-4 py-1.5 hover:border-accent hover:text-accent">
            See rewards
          </Link>
        </div>
      </section>

      <div className="rounded-3xl border border-shelf-line/60 bg-paper-raised/40 px-4 py-8 sm:px-8">
        {shelves.map((shelf) => (
          <ShelfRow
            key={shelf.slug}
            slug={shelf.slug}
            name={shelf.name}
            description={shelf.description}
            books={shelf.books}
            savedIds={savedIds}
            currentUser={user ? { id: user.id, walletBalance: user.walletBalance } : null}
          />
        ))}
      </div>
    </div>
  );
}
