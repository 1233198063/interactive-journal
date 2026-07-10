import { motion } from "framer-motion";

interface StickerProps {
  emoji: string;
  size?: number;
}

/** A tappable emoji sticker that wiggles playfully — a tiny surprise, not content. */
export function Sticker({ emoji, size = 40 }: StickerProps) {
  return (
    <motion.button
      type="button"
      aria-hidden
      tabIndex={-1}
      className="flex cursor-default items-center justify-center rounded-full bg-white/70 shadow-[var(--shadow-paper)] outline-none"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
      whileHover={{ scale: 1.12, rotate: [0, -8, 8, -4, 0] }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {emoji}
    </motion.button>
  );
}
