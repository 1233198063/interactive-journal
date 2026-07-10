import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { Journal } from "../journal/types";
import { themeAccent } from "../journal/theme";
import { PageView } from "./PageView";

/** Page-turn variants. `custom` carries the navigation direction. */
const pageVariants: Variants = {
  enter: (dir: number) => ({ rotateY: dir > 0 ? -75 : 75, opacity: 0 }),
  center: { rotateY: 0, opacity: 1 },
  exit: (dir: number) => ({ rotateY: dir > 0 ? 75 : -75, opacity: 0 }),
};

interface JournalViewerProps {
  journal: Journal;
}

/**
 * The paged reading experience. One page is shown at a time inside a "paper"
 * card; navigating flips between pages with a page-turn transition. Swipe on
 * touch, or use the on-screen controls.
 */
export function JournalViewer({ journal }: JournalViewerProps) {
  const [index, setIndex] = useState(0);
  // direction: 1 forward, -1 back — drives the turn animation.
  const [direction, setDirection] = useState(1);
  const accent = themeAccent[journal.theme].accent;

  const total = journal.pages.length;
  const page = journal.pages[index];

  const go = (next: number) => {
    if (next < 0 || next >= total) return;
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 px-4 py-6">
      {/* Page stage */}
      <div
        className="relative w-full max-w-md flex-1"
        style={{ perspective: "1600px" }}
      >
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          <motion.div
            key={page.id}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: direction > 0 ? "left" : "right" }}
            className="absolute inset-0"
          >
            <div
              className="h-full w-full rounded-[14px] border border-[var(--color-paper-shadow)] shadow-[var(--shadow-lift)]"
              style={{ backgroundColor: "var(--color-paper)" }}
            >
              <PageView page={page} accent={accent} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex w-full max-w-md items-center justify-between">
        <NavButton
          direction="prev"
          disabled={index === 0}
          onClick={() => go(index - 1)}
        />

        <div className="flex items-center gap-2">
          {journal.pages.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Go to page ${i + 1}${p.label ? `: ${p.label}` : ""}`}
              onClick={() => go(i)}
              className="h-2.5 rounded-full transition-all"
              style={{
                width: i === index ? 22 : 10,
                backgroundColor:
                  i === index ? accent : "var(--color-paper-shadow)",
              }}
            />
          ))}
        </div>

        <NavButton
          direction="next"
          disabled={index === total - 1}
          onClick={() => go(index + 1)}
        />
      </div>

      <p className="text-sm text-[var(--color-ink-soft)]">
        {page.label ? `${page.label} · ` : ""}
        {index + 1} / {total}
      </p>
    </div>
  );
}

function NavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous page" : "Next page"}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--color-paper-shadow)] bg-[var(--color-paper-deep)] text-[var(--color-ink)] shadow-[var(--shadow-paper)] transition-opacity disabled:cursor-default disabled:opacity-30"
    >
      {direction === "prev" ? "‹" : "›"}
    </button>
  );
}
