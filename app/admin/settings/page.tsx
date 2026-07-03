import { PLATFORM_COMMISSION, MIN_PAYOUT_THRESHOLD, TIP_PRESETS } from "@/lib/book-helpers";
import { formatNaira } from "@/lib/format";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="font-display mb-6 text-2xl">Settings</h1>
      <div className="max-w-lg space-y-4">
        <div className="rounded-xl border border-shelf-line bg-paper-raised p-5">
          <p className="text-xs tracking-wide text-ink-muted uppercase">Platform commission</p>
          <p className="font-display text-2xl">{PLATFORM_COMMISSION * 100}%</p>
        </div>
        <div className="rounded-xl border border-shelf-line bg-paper-raised p-5">
          <p className="text-xs tracking-wide text-ink-muted uppercase">Minimum payout threshold</p>
          <p className="font-display text-2xl">{formatNaira(MIN_PAYOUT_THRESHOLD)}</p>
        </div>
        <div className="rounded-xl border border-shelf-line bg-paper-raised p-5">
          <p className="text-xs tracking-wide text-ink-muted uppercase">Tip presets</p>
          <p className="font-display text-2xl">{TIP_PRESETS.map((t) => formatNaira(t)).join(" · ")}</p>
        </div>
        <p className="text-xs text-ink-muted">
          This preview build simulates tipping with a demo wallet — connect a real payment processor
          (e.g. a Nigerian payments gateway) before launching with real money.
        </p>
      </div>
    </div>
  );
}
