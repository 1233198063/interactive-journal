import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Journal } from "../journal/types";
import { useFortuneJar } from "./useFortuneJar";
import { Bucket } from "./Bucket";
import { Stick } from "./Stick";
import { StickReveal } from "./StickReveal";

interface FortuneJarModalProps {
  journal: Journal;
  onClose: () => void;
}

/** Full-screen "happiness bucket": shake (or tap) to draw a stick, then open it. */
export function FortuneJarModal({ journal, onClose }: FortuneJarModalProps) {
  const {
    phase,
    drawnStick,
    isHiddenStick,
    bucketRefilled,
    needsMotionPermission,
    motionEnabled,
    requestMotionPermission,
    shake,
    drawNext,
  } = useFortuneJar(journal);
  const [revealed, setRevealed] = useState(false);

  if (!journal.fortune) return null;

  const hint =
    phase === "idle"
      ? "晃一晃手机，或者点一下签筒"
      : phase === "shaking"
        ? "签筒摇晃中…"
        : "点开这支签，看看写了什么";

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[900] flex flex-col items-center justify-center gap-6 px-6 py-8"
      style={{ backgroundColor: "var(--color-paper)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="关闭抽签桶"
        className="absolute right-5 top-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-lg text-[var(--color-ink-soft)]"
        style={{ backgroundColor: "var(--color-paper-deep)" }}
      >
        ✕
      </button>

      <p className="text-2xl" style={{ fontFamily: "var(--font-hand)", color: "var(--color-ink)" }}>
        幸福签筒
      </p>

      <AnimatePresence mode="wait">
        {phase !== "drawn" ? (
          <motion.button
            key="bucket"
            type="button"
            onClick={shake}
            disabled={phase === "shaking"}
            aria-label="摇一摇签筒"
            className="cursor-pointer outline-none disabled:cursor-default"
          >
            <Bucket shaking={phase === "shaking"} />
          </motion.button>
        ) : (
          <motion.div
            key="stick"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            {drawnStick && <Stick category={drawnStick.category} onOpen={() => setRevealed(true)} />}
            {bucketRefilled && (
              <p className="text-sm text-[var(--color-ink-soft)]">签筒空啦，已经重新装满~</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "idle" && needsMotionPermission && !motionEnabled && (
        <button
          type="button"
          onClick={requestMotionPermission}
          className="cursor-pointer rounded-full px-5 py-2 text-sm text-white shadow-[var(--shadow-paper)]"
          style={{ backgroundColor: "var(--color-dusk)" }}
        >
          允许"摇一摇"
        </button>
      )}

      <p className="max-w-xs text-center text-sm text-[var(--color-ink-soft)]">{hint}</p>

      <AnimatePresence>
        {revealed && drawnStick && (
          <StickReveal
            content={drawnStick.content}
            isHidden={isHiddenStick}
            onClose={() => {
              setRevealed(false);
              drawNext();
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>,
    document.body
  );
}
