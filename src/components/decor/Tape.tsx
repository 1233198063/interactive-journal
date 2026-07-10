import type { TapeVariant } from "@/features/journal/types";

interface TapeProps {
  variant?: TapeVariant;
  color?: string;
  /** Degrees of tilt. */
  rotate?: number;
  className?: string;
}

const patternStyle: Record<TapeVariant, (color: string) => React.CSSProperties> = {
  solid: (color) => ({ backgroundColor: color }),
  stripe: (color) => ({
    backgroundColor: color,
    backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.55) 0 4px, transparent 4px 9px)`,
  }),
  dot: (color) => ({
    backgroundColor: color,
    backgroundImage: `radial-gradient(rgba(255,255,255,0.6) 1.5px, transparent 1.5px)`,
    backgroundSize: "8px 8px",
  }),
  gingham: (color) => ({
    backgroundColor: color,
    backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.45) 0 3px, transparent 3px 9px), repeating-linear-gradient(90deg, rgba(255,255,255,0.45) 0 3px, transparent 3px 9px)`,
  }),
};

/** A torn-off strip of washi tape, semi-transparent like real tape. */
export function Tape({
  variant = "solid",
  color = "var(--color-tape)",
  rotate = -3,
  className = "",
}: TapeProps) {
  return (
    <span
      aria-hidden
      className={`block h-6 w-20 rounded-[1px] opacity-80 mix-blend-multiply ${className}`}
      style={{
        ...patternStyle[variant](color),
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 1px 2px rgba(64,56,47,0.15)",
      }}
    />
  );
}
