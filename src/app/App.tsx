import { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sampleJournal } from "../features/journal/sampleJournal";
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

export function App() {
  const [stage, setStage] = useState<Stage>("gift");

  if (isStickerMakerRoute()) {
    return (
      <Suspense fallback={<div className="p-6 text-[var(--color-ink-soft)]">加载中…</div>}>
        <StickerMaker />
      </Suspense>
    );
  }

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
            <GiftOpening
              journal={sampleJournal}
              onOpened={() => setStage("journal")}
            />
          </motion.div>
        ) : (
          <motion.div
            key="journal"
            className="h-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <JournalViewer journal={sampleJournal} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
