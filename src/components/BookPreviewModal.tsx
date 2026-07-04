"use client";

import { useEffect, useState, useTransition } from "react";
import { addGuestbookNote, getBookDetail, markNoteHelpful, reportBook, tipAuthor, toggleSave, type BookDetail, type NoteDTO } from "@/app/actions";
import { serif } from "@/lib/theme";
import { useOpeningOverlay } from "./OpeningOverlayProvider";
import { useToast } from "./ToastProvider";
import buttons from "./buttons.module.css";
import styles from "./BookPreviewModal.module.css";

export function BookPreviewModal({
  bookId,
  showBadge,
  onClose,
}: {
  bookId: number;
  showBadge: boolean;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<BookDetail | null>(null);
  const [noteText, setNoteText] = useState("");
  const { showToast } = useToast();
  const { beginRead } = useOpeningOverlay();
  const [, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    getBookDetail(bookId).then((data) => {
      if (!cancelled) setDetail(data);
    });
    return () => {
      cancelled = true;
    };
    // bookId is stable for this component's lifetime — ShelfHome remounts it via `key`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!detail) {
    return (
      <div className={styles.backdrop} onClick={onClose}>
        <div
          className={styles.sheet}
          onClick={(e) => e.stopPropagation()}
          style={{
            minHeight: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#A39B8D",
            fontSize: 13,
          }}
        >
          Opening…
        </div>
      </div>
    );
  }

  const { book, saved, notes } = detail;

  function toggleSaveClick() {
    startTransition(async () => {
      const res = await toggleSave(bookId);
      setDetail((d) => (d ? { ...d, saved: res.saved } : d));
    });
  }

  function addNoteClick() {
    const text = noteText.trim();
    if (!text) return;
    setNoteText("");
    startTransition(async () => {
      const note = await addGuestbookNote(bookId, text);
      if (note) setDetail((d) => (d ? { ...d, notes: [...d.notes, note] } : d));
    });
  }

  function markHelpfulClick(note: NoteDTO) {
    if (note.markedByMe) return;
    startTransition(async () => {
      const res = await markNoteHelpful(note.id);
      setDetail((d) =>
        d
          ? { ...d, notes: d.notes.map((n) => (n.id === note.id ? { ...n, helpful: res.helpful, markedByMe: true } : n)) }
          : d
      );
    });
  }

  function reportClick() {
    startTransition(async () => {
      await reportBook(bookId);
    });
    showToast("Reported. A librarian will take a look.");
  }

  function tipClick() {
    startTransition(async () => {
      await tipAuthor(bookId);
    });
    showToast("Tip sent to the author — thank you.");
  }

  function readClick() {
    onClose();
    beginRead({ title: book.title, author: book.author, bg: book.bg, ink: book.ink }, `/read/${bookId}`);
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <button className={buttons.closeButton} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className={styles.top}>
          <div className={styles.coverColumn}>
            <div
              className={styles.cover}
              style={{
                height: book.height,
                background: book.bg,
                color: book.ink,
              }}
            >
              <div className={styles.spine3d} />
              <div className={styles.coverBand} style={{ height: book.bandHeight, background: book.accent }} />
              <div className={styles.coverFrame} style={{ opacity: book.frameOpacity }} />
              <div className={styles.coverContent} style={{ textAlign: book.align }}>
                <div
                  style={{
                    fontFamily: serif,
                    fontWeight: book.titleWeight,
                    fontSize: book.titleFontSize,
                    lineHeight: 1.16,
                    marginTop: book.titleTopMargin,
                    fontStyle: book.titleStyle,
                  }}
                >
                  {book.title}
                </div>
                <div className={styles.coverAuthor}>{book.author}</div>
              </div>
            </div>
            <div className={styles.ledge} />
          </div>

          <div className={styles.info}>
            {showBadge ? <div className={styles.badge}>{book.badge}</div> : null}
            <h1 className={styles.title}>{book.title}</h1>
            <div className={styles.byline}>
              by {book.author} · {book.shelfLabel}
            </div>
            <div className={styles.stats}>{book.stats}</div>
            <p className={styles.description}>{book.description}</p>
            <div className={styles.actions}>
              <button className={buttons.dark} onClick={readClick}>
                Read book
              </button>
              <button className={buttons.outline} onClick={toggleSaveClick}>
                {saved ? "Saved ✓" : "Save"}
              </button>
              {book.tip ? (
                <button className={buttons.outline} onClick={tipClick}>
                  Tip the author
                </button>
              ) : null}
            </div>
            {book.noTip ? <div className={styles.noTipReason}>{book.noTipReason}</div> : null}
          </div>
        </div>

        <div className={styles.guestbookSection}>
          <div className={styles.guestbookInner}>
            <div className={styles.guestbookHeader}>
              <h2 className={styles.guestbookTitle}>Guestbook</h2>
              <span className={styles.guestbookSubtitle}>Notes from readers who passed through</span>
            </div>

            <div className={styles.noteList}>
              {notes.map((n) => (
                <div key={n.id} className={styles.note}>
                  <div className={styles.noteText}>{n.note}</div>
                  <div className={styles.noteMeta}>
                    <span>— {n.name}</span>
                    <button className={buttons.linkQuiet} onClick={() => markHelpfulClick(n)} style={{ color: "#8A8276" }}>
                      Helpful · {n.helpful}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.noteForm}>
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Leave a short note…"
                className={styles.noteInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addNoteClick();
                }}
              />
              <button className={buttons.outline} style={{ padding: "0 20px", height: 44, fontSize: 13 }} onClick={addNoteClick}>
                Add note
              </button>
            </div>

            <div className={styles.reportRow}>
              <button className={styles.reportLink} onClick={reportClick}>
                Report this book
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
