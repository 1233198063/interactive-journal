/**
 * Color helpers for the journal's accent color. The accent itself is just a
 * CSS color string on the Journal/Page data — not a fixed enum — so anyone
 * viewing the journal can repick it freely. This file only supplies a quick
 * -pick palette for the color panel and a way to derive a lighter tint from
 * whatever color is chosen (used for soft backgrounds like the gift wrap).
 */

/** Quick-pick swatches shown in the color panel, deliberately not pink-first. */
export const ACCENT_PRESETS: { name: string; color: string }[] = [
  { name: "Sage", color: "#a8b89a" },
  { name: "Dusk", color: "#8a7fa8" },
  { name: "Amber", color: "#d9a441" },
  { name: "Clay", color: "#c17a5a" },
  { name: "Ocean", color: "#5b8aa3" },
  { name: "Blush", color: "#e6a4a0" },
];

/** A lighter tint of `color`, mixed toward white — for soft fills/wrapping. */
export function softTint(color: string, weight = 55): string {
  return `color-mix(in srgb, ${color} ${100 - weight}%, white)`;
}
