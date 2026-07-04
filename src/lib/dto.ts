import { formatCount, isTipEligible, noTipReason, spineVisuals, bigCoverVisuals } from "./visuals";

export type BookRow = {
  id: number;
  title: string;
  author: string;
  badge: string;
  bg: string;
  ink: string;
  accent: string;
  styleIndex: number;
  dimIndex: number;
  lean: boolean;
};

export type BookSpineDTO = ReturnType<typeof toSpineDTO>;

export function toSpineDTO(book: BookRow) {
  const v = spineVisuals(book.title, book.styleIndex, book.dimIndex);
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    badge: book.badge,
    bg: book.bg,
    ink: book.ink,
    accent: book.accent,
    lean: book.lean,
    width: v.width,
    height: v.height,
    spineWidth: v.spineWidth,
    align: v.align,
    titleFontSize: v.titleFontSize,
    titleWeight: v.titleWeight,
    titleStyle: v.titleStyle,
    titleMaxHeight: v.titleMaxHeight,
    frameOpacity: v.frameOpacity,
    bandHeight: v.bandHeight,
  };
}

export type ShelfDTO = {
  id: string;
  label: string;
  description: string;
  count: string;
  empty: boolean;
  books: BookSpineDTO[];
};

export type DetailBookRow = BookRow & {
  description: string;
  reads: number;
  saveCount: number;
  tipCount: number;
  shelfLabel: string;
};

export type BigCoverDTO = ReturnType<typeof toBigCoverDTO>;

export function toBigCoverDTO(book: DetailBookRow) {
  const v = bigCoverVisuals(book.styleIndex, book.dimIndex);
  const tip = isTipEligible(book.badge);
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    bg: book.bg,
    ink: book.ink,
    accent: book.accent,
    badge: book.badge,
    description: book.description,
    shelfLabel: book.shelfLabel,
    stats:
      `${formatCount(book.reads)} reads · ${formatCount(book.saveCount)} saves` +
      (tip ? ` · ${formatCount(book.tipCount)} tips` : ""),
    tip,
    noTip: !tip,
    noTipReason: noTipReason(book.badge),
    align: bigCoverVisuals(book.styleIndex, book.dimIndex).align,
    titleFontSize: v.titleFontSize,
    titleWeight: v.titleWeight,
    titleTopMargin: v.titleTopMargin,
    titleStyle: v.titleStyle,
    frameOpacity: v.frameOpacity,
    bandHeight: v.bandHeight,
    height: v.height,
  };
}
