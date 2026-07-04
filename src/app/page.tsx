import { Suspense } from "react";
import { getShelvesWithSpines } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { ShelfHome } from "@/components/ShelfHome";

export default async function Home() {
  const [shelves, settings] = await Promise.all([getShelvesWithSpines(), getSiteSettings()]);
  return (
    <Suspense>
      <ShelfHome shelves={shelves} showBadges={settings.showBadges} />
    </Suspense>
  );
}
