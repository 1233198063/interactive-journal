import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sampleJournal } from "../features/journal/sampleJournal";
import type { Journal } from "../features/journal/types";
import { GiftOpening } from "../features/viewer/GiftOpening";
import { JournalViewer } from "../features/viewer/JournalViewer";

type Stage = "gift" | "journal";

// Author-only tool, reached via `?tool=sticker` during local development —
// never linked from the shared gift/journal flow. Lazy-loaded so its
// background-removal dependency never ships in the recipient's bundle.
const StickerMaker = lazy(() =>
  import("../features/builder/StickerMaker").then((mod) => ({ default: mod.StickerMaker }))
);

function isStickerMakerRoute() {
  return typeof window !== "undefined" && new URLSearchParams(window.location.search).get("tool") === "sticker";
}

// Colors the person viewing this journal picks are theirs alone — a local
// overlay on top of the finished piece the author made, stored per-browser.
// The author's own choices live in the journal data (sampleJournal.ts) and
// are never overwritten by a viewer's tweaks.
const COLORS_KEY = `unfold:${sampleJournal.id}:colors`;

interface SavedColors {
  accentColor?: string;
  pageAccents?: Record<string, string>;
}

function loadSavedColors(): SavedColors {
  try {
    const raw = localStorage.getItem(COLORS_KEY);
    return raw ? (JSON.parse(raw) as SavedColors) : {};
  } catch {
    return {};
  }
}

function withSavedColors(base: Journal): Journal {
  const saved = loadSavedColors();
  if (!saved.accentColor && !saved.pageAccents) return base;
  return {
    ...base,
    accentColor: saved.accentColor ?? base.accentColor,
    pages: base.pages.map((page) => ({
      ...page,
      accentColor: saved.pageAccents?.[page.id] ?? page.accentColor,
    })),
  };
}

export function App() {
  const [stage, setStage] = useState<Stage>("gift");
  const [journal, setJournal] = useState<Journal>(() => withSavedColors(sampleJournal));

  // Persist only the color overlay — never the author's original content —
  // so this viewer's picks stick around on reload without touching the
  // shipped journal.
  useEffect(() => {
    try {
      const pageAccents: Record<string, string> = {};
      for (const page of journal.pages) {
        if (page.accentColor) pageAccents[page.id] = page.accentColor;
      }
      const toSave: SavedColors = { accentColor: journal.accentColor, pageAccents };
      localStorage.setItem(COLORS_KEY, JSON.stringify(toSave));
    } catch {
      // Private browsing / storage disabled — colors just won't persist.
    }
  }, [journal]);

  if (isStickerMakerRoute()) {
    return (
      <Suspense fallback={<div className="p-6 text-[var(--color-ink-soft)]">加载中…</div>}>
        <StickerMaker />
      </Suspense>
    );
  }

  const handleAccentChange = (color: string) => {
    setJournal((j) => ({ ...j, accentColor: color }));
  };

  const handlePageAccentChange = (pageId: string, color: string | null) => {
    setJournal((j) => ({
      ...j,
      pages: j.pages.map((page) =>
        page.id === pageId ? { ...page, accentColor: color ?? undefined } : page
      ),
    }));
  };

  return (
    <main className="mx-auto flex h-full max-w-lg flex-col sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
      <AnimatePresence mode="wait">
        {stage === "gift" ? (
          <motion.div
            key="gift"
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <GiftOpening journal={journal} onOpened={() => setStage("journal")} />
          </motion.div>
        ) : (
          <motion.div
            key="journal"
            className="h-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <JournalViewer
              journal={journal}
              onAccentChange={handleAccentChange}
              onPageAccentChange={handlePageAccentChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
