export const LEVELS = [
  { min: 0, name: "New Contributor" },
  { min: 50, name: "Contributor" },
  { min: 200, name: "Trusted Contributor" },
  { min: 500, name: "Library Fellow" },
  { min: 1000, name: "Master Archivist" },
] as const;

export function getLevel(points: number) {
  let current: (typeof LEVELS)[number] = LEVELS[0];
  for (const level of LEVELS) {
    if (points >= level.min) current = level;
  }
  return current.name;
}

export function nextLevel(points: number) {
  const upcoming = LEVELS.find((level) => level.min > points);
  return upcoming ?? null;
}

export const POINT_VALUES = {
  APPROVED_UPLOAD: 50,
  ACCURATE_METADATA: 10,
  HELPFUL_SUMMARY: 10,
  VALID_REPORT: 20,
  HELPFUL_GUESTBOOK_NOTE: 5,
  READ_MILESTONE: 20,
} as const;

export const READ_MILESTONES = [50, 100, 500, 1000, 5000];

export function badgesForContributor(input: {
  points: number;
  isVerified: boolean;
  approvedBooks: number;
  validReports: number;
}) {
  const badges: string[] = [];
  if (input.approvedBooks >= 1) badges.push("Shelf Debut");
  if (input.approvedBooks >= 5) badges.push("Prolific Contributor");
  if (input.isVerified) badges.push("Verified Author");
  if (input.validReports >= 3) badges.push("Community Guardian");
  if (input.points >= 500) badges.push("Library Fellow");
  return badges;
}
