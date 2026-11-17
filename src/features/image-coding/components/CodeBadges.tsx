import type { ImageCode } from "../types";

export function CodeDot({ code }: { code: ImageCode }) {
  const imageCount = code.imageNames.length;
  return (
    <span
      title={`${code.text} (${imageCount} image${imageCount === 1 ? "" : "s"})`}
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10 dark:ring-white/20"
      style={{ backgroundColor: code.color }}
    />
  );
}

export function CodeDotRow({ codes, limit = 8 }: { codes: ImageCode[]; limit?: number }) {
  const visible = codes.slice(0, limit);

  return (
    <div className="flex min-h-[10px] items-center gap-1">
      {visible.map((code) => (
        <CodeDot key={code.id} code={code} />
      ))}
      {codes.length > limit && (
        <span className="text-[10px] font-medium text-muted-foreground">+{codes.length - limit}</span>
      )}
    </div>
  );
}

export function CodeChip({ code }: { code: ImageCode }) {
  return (
    <span className="flex max-w-full items-start gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground">
      <span
        className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: code.color }}
      />
      <span className="whitespace-pre-wrap break-words">{code.text}</span>
    </span>
  );
}
