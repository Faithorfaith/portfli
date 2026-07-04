"use client";

import type { CSSProperties } from "react";
import type { BookSpineDTO } from "@/lib/dto";
import styles from "./Bookcase.module.css";

type SpineCSSProperties = CSSProperties & { "--lean-transform"?: string };

export function BookSpine({ book, onOpen }: { book: BookSpineDTO; onOpen: (id: number) => void }) {
  const leanMargin = book.lean ? { marginLeft: 16, marginRight: 6 } : {};

  const spineStyle: SpineCSSProperties = {
    width: book.width,
    height: book.height,
    background: book.bg,
    color: book.ink,
    "--lean-transform": book.lean ? "rotate(-7deg)" : "none",
    ...leanMargin,
  };

  return (
    <div onClick={() => onOpen(book.id)} className={styles.spine} style={spineStyle}>
      <div className={styles.band} style={{ height: book.bandHeight, background: book.accent }} />
      <div className={styles.titleCol}>
        <div className={styles.rule} style={{ opacity: book.frameOpacity }} />
        <div
          className={styles.titleText}
          style={{
            fontWeight: book.titleWeight,
            fontStyle: book.titleStyle,
            fontSize: book.titleFontSize,
            maxHeight: book.titleMaxHeight,
          }}
        >
          {book.title}
        </div>
        <div className={styles.spacer} />
        <div className={styles.authorText}>{book.author}</div>
        <div className={styles.rule} style={{ opacity: book.frameOpacity }} />
      </div>
    </div>
  );
}
