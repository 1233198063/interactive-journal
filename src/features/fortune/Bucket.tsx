import { motion } from "framer-motion";

interface BucketProps {
  shaking: boolean;
}

/** A naive, hand-drawn "happiness bucket" full of fortune sticks. */
export function Bucket({ shaking }: BucketProps) {
  return (
    <motion.svg
      width={180}
      height={180}
      viewBox="0 0 180 180"
      fill="none"
      style={{ transformOrigin: "50% 92%" }}
      animate={
        shaking
          ? { rotate: [0, -10, 9, -8, 7, -4, 0], x: [0, -6, 6, -4, 4, -2, 0] }
          : { rotate: [0, -2, 2, 0] }
      }
      transition={
        shaking
          ? { duration: 0.7, ease: "easeInOut" }
          : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
      }
    >
      {/* sticks poking out of the jar */}
      <g stroke="var(--color-ink-soft)" strokeWidth="3" strokeLinecap="round">
        <line x1="70" y1="55" x2="63" y2="17" />
        <line x1="90" y1="52" x2="96" y2="11" />
        <line x1="109" y1="56" x2="119" y2="21" />
      </g>

      {/* wobbly hand-drawn bucket body */}
      <path
        d="M40 68 Q38 65 45 65 L135 65 Q142 65 140 68 L124 158 Q123 163 118 163 L62 163 Q57 163 56 158 Z"
        fill="var(--color-paper-deep)"
        stroke="var(--color-ink)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* rim */}
      <ellipse
        cx="90"
        cy="66"
        rx="50"
        ry="10"
        fill="var(--color-paper)"
        stroke="var(--color-ink)"
        strokeWidth="3.5"
      />

      {/* heart doodle on the front */}
      <path
        d="M90 120c-11-9-22-16-22-27 0-7 6-11 11-11 5 0 9 3 11 7 2-4 6-7 11-7 5 0 11 4 11 11 0 11-11 18-22 27z"
        fill="var(--color-blush)"
        opacity="0.85"
      />
    </motion.svg>
  );
}
