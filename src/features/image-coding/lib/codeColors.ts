import type { ImageCode } from "../types";

/**
 * Palette used to give each code a stable visual identity in the legend and
 * on top of the screenshots.
 */
export const CODE_COLORS = [
  "#e11d48",
  "#2563eb",
  "#16a34a",
  "#d97706",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
  "#c2410c",
  "#475569",
];

/**
 * Picks the least used color in the current set so that codes stay visually
 * distinguishable for as long as possible.
 */
export function nextCodeColor(codes: ImageCode[]): string {
  const usage = new Map<string, number>();
  for (const color of CODE_COLORS) {
    usage.set(color, 0);
  }

  for (const code of codes) {
    usage.set(code.color, (usage.get(code.color) ?? 0) + 1);
  }

  let leastUsed = CODE_COLORS[0];
  for (const color of CODE_COLORS) {
    if ((usage.get(color) ?? 0) < (usage.get(leastUsed) ?? 0)) {
      leastUsed = color;
    }
  }

  return leastUsed;
}
