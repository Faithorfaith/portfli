"use client";

import type { ShelfDTO } from "@/lib/dto";
import { BookSpine } from "./BookSpine";
import { useToast } from "./ToastProvider";
import styles from "./Bookcase.module.css";

export function Bookcase({ shelves, onOpenBook }: { shelves: ShelfDTO[]; onOpenBook: (id: number) => void }) {
  const { showToast } = useToast();

  return (
    <div className={styles.frame}>
      {shelves.map((shelf) => (
        <div key={shelf.id}>
          <div className={styles.shelfBoard}>
            <div className={styles.shelfHeader}>
              <div className={styles.shelfLabelGroup}>
                <h2 className={styles.shelfLabel}>{shelf.label}</h2>
                <span className={styles.shelfDesc}>{shelf.description}</span>
              </div>
              <div className={styles.shelfMeta}>
                <span>{shelf.count}</span>
                <button className={styles.viewAll} onClick={() => showToast("Coming in the next iteration of this prototype.")}>
                  View all
                </button>
              </div>
            </div>

            {shelf.empty ? (
              <div className={styles.emptyMessage}>
                <div className={styles.emptyText}>
                  Nothing on the shelf matches that — try another title, author, or shelf name.
                </div>
              </div>
            ) : null}

            <div className={styles.booksRow}>
              {shelf.books.map((book) => (
                <BookSpine key={book.id} book={book} onOpen={onOpenBook} />
              ))}
            </div>
          </div>
          <div className={styles.ledge} />
        </div>
      ))}
    </div>
  );
}
