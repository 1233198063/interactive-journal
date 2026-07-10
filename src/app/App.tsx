import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sampleJournal } from "../features/journal/sampleJournal";
import { GiftOpening } from "../features/viewer/GiftOpening";
import { JournalViewer } from "../features/viewer/JournalViewer";

type Stage = "gift" | "journal";

export function App() {
  const [stage, setStage] = useState<Stage>("gift");

  return (
    <main className="mx-auto flex h-full max-w-lg flex-col">
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
