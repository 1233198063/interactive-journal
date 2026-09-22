import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Journal } from "../journal/types";
import { softTint } from "../journal/theme";

interface GiftOpeningProps {
  journal: Journal;
  onOpened: () => void;
}

/**
 * The opening ritual. A wrapped gift box sits waiting; tapping it lifts the
 * lid, the box falls away, and we hand off to the journal. This is the first
 * "unfold" — the moment that sets the tone before any content is read.
 */
export function GiftOpening({ journal, onOpened }: GiftOpeningProps) {
  const [opening, setOpening] = useState(false);
  const accent = journal.accentColor;
  const soft = softTint(accent);

  const open = () => {
    if (opening) return;
    setOpening(true);
    // Give the animation time to play before revealing the journal.
    window.setTimeout(onOpened, 1500);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-[var(--color-ink-soft)]"
        style={{ fontFamily: "var(--font-hand)", fontSize: "1.4rem" }}
      >
        For {journal.recipient}
      </motion.p>

      <button
        type="button"
        onClick={open}
        aria-label="Open your gift"
        className="relative cursor-pointer outline-none"
        style={{ width: 200, height: 200 }}
      >
        {/* Box base */}
        <motion.div
          className="absolute inset-x-0 bottom-0 rounded-[10px]"
          style={{ height: 150, backgroundColor: soft }}
          animate={
            opening
              ? { y: 220, rotate: -8, opacity: 0 }
              : { y: 0, rotate: 0, opacity: 1 }
          }
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        >
          {/* Vertical ribbon */}
          <div
            className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2"
            style={{ backgroundColor: accent }}
          />
        </motion.div>

        {/* Lid */}
        <motion.div
          className="absolute inset-x-0 rounded-[8px] shadow-[var(--shadow-paper)]"
          style={{ top: 30, height: 52, backgroundColor: accent }}
          animate={
            opening
              ? { y: -140, rotate: 14, opacity: 0 }
              : { y: [0, -6, 0] }
          }
          transition={
            opening
              ? { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
              : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {/* Bow */}
          <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 gap-1">
            <span
              className="block h-8 w-8 -rotate-12 rounded-full"
              style={{ backgroundColor: soft }}
            />
            <span
              className="block h-8 w-8 rotate-12 rounded-full"
              style={{ backgroundColor: soft }}
            />
          </div>
        </motion.div>

        {/* Burst of light on open */}
        <AnimatePresence>
          {opening && (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: "#fff" }}
              initial={{ width: 0, height: 0, opacity: 0.9 }}
              animate={{ width: 420, height: 420, opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
          )}
        </AnimatePresence>
      </button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-xs text-[var(--color-ink-soft)]"
      >
        {journal.coverMessage ?? "Tap to open."}
      </motion.p>
    </div>
  );
}
