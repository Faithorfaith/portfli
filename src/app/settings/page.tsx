import { getSiteSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/SettingsForm";

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  return <SettingsForm initial={settings} />;
}
