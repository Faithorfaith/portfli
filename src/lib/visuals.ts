// Shared spine/cover rendering math, ported from the OpenShelf.dc.html prototype.

export const DIMS: [number, number][] = [
  [118, 178],
  [128, 192],
  [120, 172],
  [132, 198],
  [122, 182],
  [116, 170],
];

export const SPINE_WIDTHS = [44, 52, 38, 58, 46, 36];

export type SpineStyle = {
  align: "left" | "center";
  titleSize: number;
  titleWeight: number;
  titleTopMargin: number;
  titleStyle: "normal" | "italic";
  frameOpacity: number;
  bandHeight: number;
};

export const STYLES: SpineStyle[] = [
  { align: "center", titleSize: 16, titleWeight: 500, titleTopMargin: 26, titleStyle: "normal", frameOpacity: 0.35, bandHeight: 0 },
  { align: "left", titleSize: 15, titleWeight: 600, titleTopMargin: 6, titleStyle: "normal", frameOpacity: 0, bandHeight: 10 },
  { align: "center", titleSize: 15, titleWeight: 420, titleTopMargin: 40, titleStyle: "italic", frameOpacity: 0, bandHeight: 0 },
  { align: "left", titleSize: 17, titleWeight: 500, titleTopMargin: 16, titleStyle: "normal", frameOpacity: 0.28, bandHeight: 0 },
];

export function spineFontSize(title: string) {
  return title.length > 24 ? 11 : title.length > 15 ? 12.5 : 14.5;
}

export function isTipEligible(badge: string) {
  return badge === "Verified" || badge === "Original";
}

export function noTipReason(badge: string) {
  if (badge === "Public Domain") return "Public domain — tips are disabled for this book.";
  if (badge === "Free Licensed") return "Free licensed — tips are disabled for this book.";
  return "";
}

export type SpineVisuals = SpineStyle & {
  width: number;
  height: number;
  spineWidth: number;
  titleFontSize: number;
  titleMaxHeight: number;
};

export function spineVisuals(title: string, styleIndex: number, dimIndex: number): SpineVisuals {
  const style = STYLES[styleIndex];
  const [w, h] = DIMS[dimIndex];
  return {
    ...style,
    width: w,
    height: h + 22,
    spineWidth: SPINE_WIDTHS[dimIndex],
    titleFontSize: spineFontSize(title),
    titleMaxHeight: h - 68,
  };
}

export type BigCoverVisuals = SpineStyle & {
  height: number;
  titleFontSize: number;
  titleTopMargin: number;
  bandHeight: number;
};

/** Scaled-up dimensions used for the preview modal / back cover, matching the prototype's 1.55-1.62x cover math. */
export function bigCoverVisuals(styleIndex: number, dimIndex: number): BigCoverVisuals {
  const style = STYLES[styleIndex];
  const [, h] = DIMS[dimIndex];
  return {
    ...style,
    height: Math.round(h * 1.62),
    titleFontSize: Math.round(style.titleSize * 1.55),
    titleTopMargin: Math.round(style.titleTopMargin * 1.55),
    bandHeight: style.bandHeight ? Math.round(style.bandHeight * 1.6) : 0,
  };
}

export function formatCount(n: number) {
  if (n >= 1000) {
    const v = n / 1000;
    const rounded = v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, "");
    return `${rounded}k`;
  }
  return String(n);
}
