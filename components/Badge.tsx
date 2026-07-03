const STYLES: Record<string, string> = {
  Verified: "bg-ink text-paper-raised border-ink",
  Original: "bg-black/5 text-ink-muted border-black/10",
  "Public Domain": "bg-black/5 text-ink-muted border-black/10",
  "Free Licensed": "bg-black/5 text-ink-muted border-black/10",
};

export default function Badge({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide ${
        STYLES[label] ?? "bg-black/5 text-ink-muted border-black/10"
      }`}
    >
      {label}
    </span>
  );
}
