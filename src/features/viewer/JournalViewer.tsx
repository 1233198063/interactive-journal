import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { Journal, Page } from "../journal/types";
import { PageView } from "./PageView";
import { FortuneJarModal } from "../fortune/FortuneJarModal";
import { ColorPanel } from "./ColorPanel";

/**
 * Page-turn variants for one slot (left or right half of the stage).
 * `custom` is refreshed by AnimatePresence even for the element that's
 * exiting, so — unlike swapping between two different `variants` objects —
 * this stays correct no matter which direction the *previous* turn went.
 *
 * Only the page actually being turned (`turns: true`) gets the flip; it
 * rotates a full half-turn around the spine edge so it visually swings over
 * and settles on top of the other page, like a real leaf landing once
 * turned. The page that isn't turning just settles in with a fade.
 */
type TurnCustom = { direction: number; turns: boolean; origin: "left" | "right" };

const pageVariants: Variants = {
  enter: ({ turns, origin }: TurnCustom) =>
    turns
      ? { rotateY: 0, opacity: 0, transformOrigin: origin, zIndex: 1 }
      : { opacity: 0, transformOrigin: origin, zIndex: 1 },
  center: ({ origin }: TurnCustom) => ({
    rotateY: 0,
    opacity: 1,
    transformOrigin: origin,
    zIndex: 1,
  }),
  exit: ({ direction, turns, origin }: TurnCustom) =>
    turns
      ? {
          // A near-full turn around the spine so the page visually sweeps
          // over and covers its neighbor, not just tilts in place.
          rotateY: direction > 0 ? -170 : 170,
          opacity: 1,
          transformOrigin: origin,
          zIndex: 2,
        }
      : { opacity: 0, transformOrigin: origin, zIndex: 1 },
};

const TURN_TRANSITION = {
  duration: 0.6,
  ease: [0.45, 0, 0.55, 1] as const,
  // zIndex has no meaningful "in-between" value — tweening it smoothly can
  // leave it briefly fractional, which flickers the stacking order right as
  // the turning page should land on top. Snap it instantly instead.
  zIndex: { duration: 0 },
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
  /** Repick the whole journal's accent color. */
  onAccentChange: (color: string) => void;
  /** Repick one page's accent color, or pass `null` to go back to the journal color. */
  onPageAccentChange: (pageId: string, color: string | null) => void;
}

/**
 * The paged reading experience. On a wide screen the journal lies open like
 * a real book — a left and a right page at once. On a phone there's only
 * room for one page, so it reads as a single stacked card. Navigating flips
 * between pages (or spreads) with a page-turn transition.
 */
export function JournalViewer({
  journal,
  onAccentChange,
  onPageAccentChange,
}: JournalViewerProps) {
  const isSpread = useMediaQuery(BOOK_QUERY);
  const [index, setIndex] = useState(0);
  // direction: 1 forward, -1 back — drives the turn animation.
  const [direction, setDirection] = useState(1);
  const [fortuneOpen, setFortuneOpen] = useState(false);
  const [colorsOpen, setColorsOpen] = useState(false);
  const accent = journal.accentColor;

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
  // turns. Each slot's pivot sits at the spine (its inner edge) so a turn
  // sweeps over the neighboring page rather than spinning in place.
  const leftTurns = !isSpread || direction < 0;
  const rightTurns = isSpread && direction > 0;
  const leftOrigin: "left" | "right" = isSpread
    ? "right"
    : direction > 0
      ? "right"
      : "left";

  const colorTargets = [
    { id: leftPage.id, label: leftPage.label ?? "left", color: leftPage.accentColor },
    ...(rightPage
      ? [{ id: rightPage.id, label: rightPage.label ?? "right", color: rightPage.accentColor }]
      : []),
  ];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 px-4 py-6">
      <div className={`flex w-full items-center justify-between ${STAGE_WIDTH}`}>
        <button
          type="button"
          onClick={() => setColorsOpen(true)}
          aria-label="Pick colors"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white text-xl shadow-[var(--shadow-paper)]"
        >
          🎨
        </button>

        {journal.fortune && (
          <button
            type="button"
            onClick={() => setFortuneOpen(true)}
            aria-label="打开幸福签筒"
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-xl text-white shadow-[var(--shadow-paper)]"
            style={{ backgroundColor: accent }}
          >
            🪄
          </button>
        )}
      </div>

      {/* Page stage */}
      <div
        className={`relative w-full flex-1 ${STAGE_WIDTH}`}
        style={{ perspective: "1600px" }}
      >
        <div className="absolute inset-0 flex gap-4 sm:gap-6">
          <AnimatePresence
            initial={false}
            mode="popLayout"
            custom={{ direction, turns: leftTurns, origin: leftOrigin }}
          >
            <motion.div
              key={leftIndex}
              custom={{ direction, turns: leftTurns, origin: leftOrigin }}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={TURN_TRANSITION}
              style={{ willChange: "transform" }}
              className="h-full min-w-0 flex-1"
            >
              <PaperCard
                page={leftPage}
                accent={leftPage.accentColor ?? accent}
                className="h-full"
              />
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
              <AnimatePresence
                initial={false}
                mode="popLayout"
                custom={{ direction, turns: rightTurns, origin: "left" }}
              >
                <motion.div
                  key={rightIndex ?? "blank"}
                  custom={{ direction, turns: rightTurns, origin: "left" }}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={TURN_TRANSITION}
                  style={{ willChange: "transform" }}
                  className="h-full min-w-0 flex-1"
                >
                  {rightPage ? (
                    <PaperCard
                      page={rightPage}
                      accent={rightPage.accentColor ?? accent}
                      className="h-full"
                    />
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

      {colorsOpen && (
        <ColorPanel
          journalColor={accent}
          pageTargets={colorTargets}
          onJournalColor={onAccentChange}
          onPageColor={onPageAccentChange}
          onClose={() => setColorsOpen(false)}
        />
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
