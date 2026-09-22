import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ACCENT_PRESETS } from "../journal/theme";

interface PageColorTarget {
  id: string;
  label: string;
  color?: string;
}

interface ColorPanelProps {
  journalColor: string;
  /** The page(s) currently on screen — one in single-page mode, two in a spread. */
  pageTargets: PageColorTarget[];
  onJournalColor: (color: string) => void;
  onPageColor: (pageId: string, color: string | null) => void;
  onClose: () => void;
}

/**
 * Lets whoever is looking at the journal — the person who made it, or the
 * person it's for — repick the accent color. One color for the whole
 * journal, plus an optional override per page. Changes apply live; the
 * caller decides what (if anything) to persist.
 */
export function ColorPanel({
  journalColor,
  pageTargets,
  onJournalColor,
  onPageColor,
  onClose,
}: ColorPanelProps) {
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[900] flex items-center justify-center bg-black/20 px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-sm overflow-y-auto rounded-[14px] border border-[var(--color-paper-shadow)] px-6 py-6 shadow-[var(--shadow-lift)]"
        style={{ backgroundColor: "var(--color-paper)", maxHeight: "85vh" }}
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close color picker"
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--color-ink-soft)]"
          style={{ backgroundColor: "var(--color-paper-deep)" }}
        >
          ✕
        </button>

        <p
          className="mb-4 text-xl"
          style={{ fontFamily: "var(--font-hand)", color: "var(--color-ink)" }}
        >
          Pick your colors
        </p>

        <ColorField
          label="Whole journal"
          value={journalColor}
          onChange={onJournalColor}
        />

        {pageTargets.map((page) => (
          <ColorField
            key={page.id}
            label={`This page — ${page.label}`}
            value={page.color ?? journalColor}
            onChange={(color) => onPageColor(page.id, color)}
            onReset={page.color ? () => onPageColor(page.id, null) : undefined}
          />
        ))}
      </motion.div>
    </motion.div>,
    document.body
  );
}

function ColorField({
  label,
  value,
  onChange,
  onReset,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
  onReset?: () => void;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-[var(--color-ink-soft)]">{label}</p>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer text-xs underline text-[var(--color-ink-soft)]"
          >
            match journal color
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {ACCENT_PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            aria-label={preset.name}
            onClick={() => onChange(preset.color)}
            className="h-7 w-7 shrink-0 cursor-pointer rounded-full transition-transform"
            style={{
              backgroundColor: preset.color,
              boxShadow:
                value.toLowerCase() === preset.color.toLowerCase()
                  ? "0 0 0 2px var(--color-paper), 0 0 0 4px var(--color-ink)"
                  : "0 0 0 1px rgba(0,0,0,0.08)",
            }}
          />
        ))}
        <label
          className="relative flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-xs"
          style={{
            backgroundColor: value,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
          }}
          aria-label="Custom color"
        >
          <input
            type="color"
            value={toHex(value)}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          🎨
        </label>
      </div>
    </div>
  );
}

/** `<input type="color">` requires a #rrggbb value; fall back to a neutral if we got a non-hex CSS color. */
function toHex(color: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#a8b89a";
}
