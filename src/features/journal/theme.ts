import type { JournalTheme } from "./types";

/** Maps a journal theme to concrete accent colors from our token set. */
export const themeAccent: Record<
  JournalTheme,
  { accent: string; soft: string }
> = {
  blush: { accent: "var(--color-blush)", soft: "#f2cfcc" },
  sage: { accent: "var(--color-sage)", soft: "#cdd8c2" },
  dusk: { accent: "var(--color-dusk)", soft: "#c8c0da" },
};
