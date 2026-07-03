import CreateShelfForm from "@/components/CreateShelfForm";
import { prisma } from "@/lib/prisma";

export default async function ShelvesPage() {
  const shelves = await prisma.shelf.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { books: true } } },
  });

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl">Shelves / Categories</h1>

      <ul className="mb-8 divide-y divide-shelf-line rounded-xl border border-shelf-line bg-paper-raised">
        {shelves.map((shelf) => (
          <li key={shelf.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium">{shelf.name}</p>
              <p className="text-xs text-ink-muted">{shelf.description}</p>
            </div>
            <span className="text-sm text-ink-muted">{shelf._count.books} books</span>
          </li>
        ))}
      </ul>

      <CreateShelfForm />
    </div>
  );
}
