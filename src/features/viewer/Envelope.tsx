import { useState } from "react";
import { createPortal } from "react-dom";
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
        {open ? "tap outside to close" : block.frontLabel}
      </span>

      {/*
        The opened letter is portaled to the document body instead of being
        positioned inside the (small, edge-hugging) envelope box. That way a
        long message is never clipped by a page's overflow-hidden, no matter
        where the envelope sits on the page.
      */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-[999] flex items-center justify-center bg-[var(--color-ink)]/30 p-6 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[80vh] w-full max-w-sm overflow-y-auto rounded-[4px] bg-white px-6 py-5 text-left shadow-[var(--shadow-lift)]"
              >
                <p
                  className="whitespace-pre-line text-xl leading-snug text-[var(--color-ink)]"
                  style={{ fontFamily: "var(--font-hand)" }}
                >
                  {block.message}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
