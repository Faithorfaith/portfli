import { paletteFor } from "@/lib/cover-palette";

export default function PlaceholderCover({
  title,
  author,
}: {
  title: string;
  author: string;
}) {
  const [base, ink] = paletteFor(title + author);

  return (
    <div
      className="flex h-full w-full flex-col justify-between p-3"
      style={{ background: base, color: ink }}
    >
      <div className="border-t border-b py-2" style={{ borderColor: ink + "55" }}>
        <p className="font-display line-clamp-4 text-[13px] leading-snug italic">
          {title}
        </p>
      </div>
      <p className="truncate text-[10px] tracking-wide uppercase opacity-80">
        {author}
      </p>
    </div>
  );
}
