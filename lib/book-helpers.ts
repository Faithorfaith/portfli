type OwnershipType = "WROTE" | "PERMISSION" | "PUBLIC_DOMAIN" | "FREE_LICENSED";

export function bookBadge(book: { ownershipType: OwnershipType; submittedBy: { isVerified: boolean } }) {
  if (book.ownershipType === "PUBLIC_DOMAIN") return "Public Domain";
  if (book.ownershipType === "FREE_LICENSED") return "Free Licensed";
  return book.submittedBy.isVerified ? "Verified" : "Original";
}

export function canReceiveTips(book: {
  ownershipType: OwnershipType;
  tipEligible: boolean;
  status: string;
  submittedBy: { isVerified: boolean };
}) {
  return (
    book.status === "APPROVED" &&
    book.tipEligible &&
    book.submittedBy.isVerified &&
    (book.ownershipType === "WROTE" || book.ownershipType === "PERMISSION")
  );
}

export const TIP_PRESETS = [100, 200, 500, 1000];
export const PLATFORM_COMMISSION = 0.1;
export const MIN_PAYOUT_THRESHOLD = 5000;
