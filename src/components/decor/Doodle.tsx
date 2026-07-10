import { motion } from "framer-motion";
import type { DoodleShape } from "@/features/journal/types";

interface DoodleProps {
  shape: DoodleShape;
  color?: string;
  size?: number;
}

const paths: Record<DoodleShape, string> = {
  heart: "M12 20s-7.5-4.6-9.7-9.3C.6 6.9 2.6 3 6.4 3c2.2 0 3.8 1.3 4.6 2.7C11.8 4.3 13.4 3 15.6 3c3.8 0 5.8 3.9 4.1 7.7C21.5 15.4 12 20 12 20z",
  star: "M12 2.5l2.5 6.2 6.5.4-5.1 4.2 1.7 6.4L12 16l-5.6 3.7 1.7-6.4-5.1-4.2 6.5-.4z",
  swirl: "M4 12a8 8 0 1 1 8 8c-3 0-5-2-5-4.5S9 11 12 11s4 1.6 4 3.5",
  arrow: "M3 12h16m0 0-5-5m5 5-5 5",
  sparkle: "M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4",
};

/** A small hand-drawn-style ink doodle, scattered on the page for warmth. */
export function Doodle({ shape, color = "var(--color-ink-soft)", size = 28 }: DoodleProps) {
  return (
    <motion.svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      animate={{ rotate: [0, -6, 6, 0] }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    >
      <path
        d={paths[shape]}
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={shape === "heart" || shape === "star" ? color : "none"}
        fillOpacity={shape === "heart" || shape === "star" ? 0.15 : 0}
      />
    </motion.svg>
  );
}
