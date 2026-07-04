"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateSiteSettings } from "@/app/actions";
import type { SiteSettings } from "@/lib/settings";
import styles from "./SettingsForm.module.css";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [settings, setSettings] = useState(initial);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function save(next: SiteSettings) {
    setSettings(next);
    startTransition(async () => {
      await updateSiteSettings(next);
      setSavedAt(Date.now());
      router.refresh();
    });
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link href="/" className={styles.backLink}>
          ← Back to the shelf
        </Link>
        <h1 className={styles.heading}>Site settings</h1>
        <p className={styles.subheading}>
          These control the motion and shelf presentation for every visitor. There&apos;s no admin login yet, so
          treat this page as internal for now.
        </p>

        <div className={styles.field}>
          <div className={styles.fieldInfo}>
            <div className={styles.fieldLabel}>Book-opening animation</div>
            <div className={styles.fieldHint}>How a book grows into the reader when someone starts reading.</div>
          </div>
          <select
            className={styles.select}
            value={settings.openStyle}
            onChange={(e) => save({ ...settings, openStyle: e.target.value as SiteSettings["openStyle"] })}
          >
            <option value="swing + zoom">Swing + zoom</option>
            <option value="zoom only">Zoom only</option>
          </select>
        </div>

        <div className={styles.field}>
          <div className={styles.fieldInfo}>
            <div className={styles.fieldLabel}>Reduce motion</div>
            <div className={styles.fieldHint}>Skip the book-opening animation entirely and jump straight to the reader.</div>
          </div>
          <ToggleSwitch checked={settings.reduceMotion} onChange={(v) => save({ ...settings, reduceMotion: v })} />
        </div>

        <div className={styles.field}>
          <div className={styles.fieldInfo}>
            <div className={styles.fieldLabel}>Show badges</div>
            <div className={styles.fieldHint}>
              Show the ownership badge (Verified, Original, Public Domain, Free Licensed) on a book&apos;s detail card.
            </div>
          </div>
          <ToggleSwitch checked={settings.showBadges} onChange={(v) => save({ ...settings, showBadges: v })} />
        </div>

        <div className={styles.saveRow}>
          {isPending ? <span className={styles.savedNote}>Saving…</span> : null}
          {!isPending && savedAt ? <span className={styles.savedNote}>Saved.</span> : null}
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        flexShrink: 0,
        width: 42,
        height: 24,
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        position: "relative",
        background: checked ? "#141210" : "rgba(28,25,21,.16)",
        transition: "background .2s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 21 : 3,
          width: 18,
          height: 18,
          borderRadius: 999,
          background: "#fff",
          transition: "left .2s",
        }}
      />
    </button>
  );
}
