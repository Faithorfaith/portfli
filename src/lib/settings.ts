import { db } from "./db";

export type SiteSettings = {
  openStyle: "swing + zoom" | "zoom only";
  reduceMotion: boolean;
  showBadges: boolean;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const row = await db.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  return {
    openStyle: row.openStyle === "zoom only" ? "zoom only" : "swing + zoom",
    reduceMotion: row.reduceMotion,
    showBadges: row.showBadges,
  };
}
