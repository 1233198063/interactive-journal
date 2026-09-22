import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { Journal, Page } from "../journal/types";
import { themeAccent } from "../journal/theme";
import { PageView } from "./PageView";
import { FortuneJarModal } from "../fortune/FortuneJarModal";

/**
 * Page-turn variants for the page actually being turned. `custom` carries
 * the navigation direction. Only one side of a spread turns at a time —
 * like a real book, not two pages flipping in unison.
 */
const turnVariants: Variants = {
  enter: (dir: number) => ({ rotateY: dir > 0 ? 75 : -75, opacity: 0 }),
  center: { rotateY: 0, opacity: 1 },
  exit: (dir: number) => ({ rotateY: dir > 0 ? -75 : 75, opacity: 0 }),
};

/** The other side of a spread doesn't turn — its content just settles in. */
const staticVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

// Shared by the stage and the control rows so everything lines up, growing
// further once there's room to lay the journal open as a two-page spread.
const STAGE_WIDTH = "max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl xl:max-w-5xl";

// Above this width the journal opens like a real book — a left and a right
// page at once. Below it (phones, most tablets) there's only room for one
// page, matching the `lg` breakpoint used in STAGE_WIDTH above.
const BOOK_QUERY = "(min-width: 1024px)";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

interface JournalViewerProps {
  journal: Journal;
}

/**
 * The paged reading experience. On a wide screen the journal lies open like
 * a real book — a left and a right page at once. On a phone there's only
 * room for one page, so it reads as a single stacked card. Navigating flips
 * between pages (or spreads) with a page-turn transition.
 */
export function JournalViewer({ journal }: JournalViewerProps) {
  const isSpread = useMediaQuery(BOOK_QUERY);
  const [index, setIndex] = useState(0);
  // direction: 1 forward, -1 back — drives the turn animation.
  const [direction, setDirection] = useState(1);
  const [fortuneOpen, setFortuneOpen] = useState(false);
  const accent = themeAccent[journal.theme].accent;

  const total = journal.pages.length;

  // In spread mode pages come in pairs — always anchor to the left (even)
  // page of the current spread so the pairing doesn't drift as you navigate.
  const leftIndex = isSpread ? index - (index % 2) : index;
  const rightIndex = isSpread && leftIndex + 1 < total ? leftIndex + 1 : null;
  const leftPage = journal.pages[leftIndex];
  const rightPage = rightIndex !== null ? journal.pages[rightIndex] : null;
  const lastVisibleIndex = rightIndex ?? leftIndex;

  const step = isSpread ? 2 : 1;
  const canGoPrev = leftIndex > 0;
  const canGoNext = lastVisibleIndex < total - 1;

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(next, total - 1));
    setDirection(clamped > leftIndex ? 1 : -1);
    setIndex(clamped);
  };

  const dotCount = isSpread ? Math.ceil(total / 2) : total;
  const activeDot = isSpread ? leftIndex / 2 : leftIndex;

  const rangeLabel = rightPage
    ? `${leftIndex + 1}–${rightIndex! + 1}`
    : `${leftIndex + 1}`;
  const pageLabel = [leftPage.label, rightPage?.label].filter(Boolean).join(" · ");

  // Only the page being turned toward gets the flip: the right page turns
  // when moving forward, the left page turns when moving back — never both
  // at once. Outside of spread mode there's only one page, so it always
  // turns.
  const leftTurns = !isSpread || direction < 0;
  const rightTurns = isSpread && direction > 0;
  const leftOrigin = isSpread ? "right" : direction > 0 ? "right" : "left";

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 px-4 py-6">
      {journal.fortune && (
        <div className={`flex w-full justify-end ${STAGE_WIDTH}`}>
          <button
            type="button"
            onClick={() => setFortuneOpen(true)}
            aria-label="打开幸福签筒"
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-xl text-white shadow-[var(--shadow-paper)]"
            style={{ backgroundColor: accent }}
          >
            🪄
          </button>
        </div>
      )}

      {/* Page stage */}
      <div
        className={`relative w-full flex-1 ${STAGE_WIDTH}`}
        style={{ perspective: "1600px" }}
      >
        <div className="absolute inset-0 flex gap-4 sm:gap-6">
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.div
              key={leftIndex}
              custom={direction}
              variants={leftTurns ? turnVariants : staticVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: leftOrigin }}
              className="h-full min-w-0 flex-1"
            >
              <PaperCard page={leftPage} accent={accent} className="h-full" />
            </motion.div>
          </AnimatePresence>

          {isSpread && (
            <>
              {/* The book's spine — a soft shadow down the middle. */}
              <div
                className="hidden w-px shrink-0 rounded-full lg:block"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, var(--color-paper-shadow) 15%, var(--color-paper-shadow) 85%, transparent)",
                }}
              />
              <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                <motion.div
                  key={rightIndex ?? "blank"}
                  custom={direction}
                  variants={rightTurns ? turnVariants : staticVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "left" }}
                  className="h-full min-w-0 flex-1"
                >
                  {rightPage ? (
                    <PaperCard page={rightPage} accent={accent} className="h-full" />
                  ) : (
                    // Last, odd page out — the right side of the book stays
                    // blank rather than stretching the left page to fill it.
                    <div
                      className="h-full rounded-[14px] border border-[var(--color-paper-shadow)] shadow-[var(--shadow-lift)]"
                      style={{ backgroundColor: "var(--color-paper)" }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className={`flex w-full items-center justify-between ${STAGE_WIDTH}`}>
        <NavButton
          direction="prev"
          disabled={!canGoPrev}
          onClick={() => go(leftIndex - step)}
        />

        <div className="flex items-center gap-2">
          {Array.from({ length: dotCount }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to ${isSpread ? "spread" : "page"} ${i + 1}`}
              onClick={() => go(isSpread ? i * 2 : i)}
              className="h-2.5 rounded-full transition-all"
              style={{
                width: i === activeDot ? 22 : 10,
                backgroundColor:
                  i === activeDot ? accent : "var(--color-paper-shadow)",
              }}
            />
          ))}
        </div>

        <NavButton
          direction="next"
          disabled={!canGoNext}
          onClick={() => go(leftIndex + step)}
        />
      </div>

      <p className="text-sm text-[var(--color-ink-soft)]">
        {pageLabel ? `${pageLabel} · ` : ""}
        {rangeLabel} / {total}
      </p>

      {fortuneOpen && (
        <FortuneJarModal journal={journal} onClose={() => setFortuneOpen(false)} />
      )}
    </div>
  );
}

function PaperCard({
  page,
  accent,
  className = "",
}: {
  page: Page;
  accent: string;
  className?: string;
}) {
  return (
    <div
      className={`h-full min-w-0 rounded-[14px] border border-[var(--color-paper-shadow)] shadow-[var(--shadow-lift)] ${className}`}
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <PageView page={page} accent={accent} />
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
