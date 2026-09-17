import { motion } from "framer-motion";
import type { FortuneCategory } from "../journal/types";
import { categoryMeta } from "./categoryMeta";

interface StickProps {
  category: FortuneCategory;
  onOpen: () => void;
}

/** The closed stick that fell out of the jar — tap it to unroll and read. */
export function Stick({ category, onOpen }: StickProps) {
  const meta = categoryMeta[category];

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label="打开这支签"
      className="flex cursor-pointer flex-col items-center gap-3 outline-none"
      initial={{ y: -36, opacity: 0, rotate: -8 }}
      animate={{ y: 0, opacity: 1, rotate: [-6, 6, -3, 0] }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className="flex h-40 w-12 flex-col items-center justify-start rounded-full pt-3 shadow-[var(--shadow-paper)]"
        style={{ backgroundColor: "var(--color-paper-deep)", border: `2px solid ${meta.color}` }}
      >
        <span style={{ fontSize: 22 }}>{meta.emoji}</span>
      </div>
      <span className="text-lg" style={{ fontFamily: "var(--font-hand)", color: "var(--color-ink-soft)" }}>
        点开这支签看看
      </span>
    </motion.button>
  );
}
