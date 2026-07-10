import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { EnvelopeBlock } from "../journal/types";

interface EnvelopeProps {
  block: EnvelopeBlock;
  accent: string;
}

/**
 * A sealed envelope the reader taps to open. The flap lifts, and the letter
 * slides up and out to reveal the hidden message — one of Unfold's core
 * "interaction creates emotion" moments.
 */
export function Envelope({ block, accent }: EnvelopeProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close envelope" : `Open envelope: ${block.frontLabel}`}
        className="relative w-full cursor-pointer outline-none"
        style={{ perspective: "800px" }}
      >
        {/* Envelope body */}
        <div
          className="relative aspect-[7/4.4] w-full rounded-[6px] shadow-[var(--shadow-paper)]"
          style={{ backgroundColor: "var(--color-paper-deep)" }}
        >
          {/* The letter that slides out when open */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ y: 0, opacity: 0, scale: 0.96 }}
                animate={{ y: "-58%", opacity: 1, scale: 1 }}
                exit={{ y: 0, opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-[8%] top-[8%] z-10 rounded-[4px] bg-white/95 px-4 py-3 text-left shadow-[var(--shadow-lift)]"
              >
                <p
                  className="text-[15px] leading-snug text-[var(--color-ink)]"
                  style={{ fontFamily: "var(--font-hand)" }}
                >
                  {block.message}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Front pocket (covers the letter's bottom) */}
          <div
            className="absolute inset-x-0 bottom-0 z-20 h-[62%] rounded-b-[6px]"
            style={{
              backgroundColor: "var(--color-paper-deep)",
              clipPath: "polygon(0 22%, 50% 0, 100% 22%, 100% 100%, 0 100%)",
              boxShadow: "inset 0 2px 6px rgba(64,56,47,0.12)",
            }}
          />

          {/* Flap */}
          <motion.div
            className="absolute inset-x-0 top-0 z-30 h-[58%] origin-top"
            style={{
              transformStyle: "preserve-3d",
              backgroundColor: accent,
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
            initial={false}
            animate={{ rotateX: open ? 180 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Wax-seal-ish dot */}
          {!open && (
            <div
              className="absolute left-1/2 top-1/2 z-40 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-semibold text-white shadow-md"
              style={{ backgroundColor: "var(--color-ink)" }}
            >
              ♥
            </div>
          )}
        </div>
      </button>

      <span
        className="text-[15px] text-[var(--color-ink-soft)]"
        style={{ fontFamily: "var(--font-hand)" }}
      >
        {open ? "tap to close" : block.frontLabel}
      </span>
    </div>
  );
}
