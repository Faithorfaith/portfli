export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}

export function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const units: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [secs, label] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${label}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export const OWNERSHIP_LABEL: Record<string, string> = {
  WROTE: "I wrote this book",
  PERMISSION: "I have permission to upload this",
  PUBLIC_DOMAIN: "Public domain",
  FREE_LICENSED: "Free licensed",
};

export const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  UNDER_REVIEW: "Under Review",
  NEEDS_CHANGES: "Needs Changes",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  REMOVED: "Removed",
};
