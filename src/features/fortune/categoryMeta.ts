import type { FortuneCategory } from "../journal/types";

/** Purely cosmetic per-category styling for the closed stick face — never hints at exact content. */
export const categoryMeta: Record<FortuneCategory, { emoji: string; color: string }> = {
  funny: { emoji: "😆", color: "var(--color-blush)" },
  encourage: { emoji: "🌷", color: "var(--color-sage)" },
  memory: { emoji: "📷", color: "var(--color-dusk)" },
  music: { emoji: "🎵", color: "var(--color-blush)" },
  happiness: { emoji: "🍀", color: "var(--color-sage)" },
  gift: { emoji: "🎁", color: "var(--color-dusk)" },
};
