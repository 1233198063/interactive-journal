import { useMemo, type ReactNode } from "react";

interface TornEdgeProps {
  children: ReactNode;
  className?: string;
  /** Which edges get the torn-paper treatment. */
  edges?: Array<"top" | "bottom">;
  /** Deterministic seed so the jagged edge doesn't reshuffle on re-render. */
  seed?: string;
}

/** Cheap deterministic PRNG so a given seed always produces the same tear. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return h;
}

function buildTornPolygon(rand: () => number, points = 14) {
  const top: string[] = [];
  const bottom: string[] = [];
  for (let i = 0; i <= points; i++) {
    const x = (i / points) * 100;
    top.push(`${x}% ${(rand() * 3).toFixed(1)}%`);
  }
  for (let i = points; i >= 0; i--) {
    const x = (i / points) * 100;
    bottom.push(`${x}% ${(100 - rand() * 3).toFixed(1)}%`);
  }
  return `polygon(${top.join(",")}, ${bottom.join(",")})`;
}

/** Wraps content with a hand-torn paper edge instead of a clean rectangle. */
export function TornEdge({
  children,
  className = "",
  edges = ["top", "bottom"],
  seed = "torn",
}: TornEdgeProps) {
  const clipPath = useMemo(() => {
    const rand = mulberry32(hashSeed(seed));
    if (edges.length === 2) return buildTornPolygon(rand);
    // Only one edge torn: keep the other flush.
    const rows: string[] = [];
    const points = 14;
    if (edges.includes("top")) {
      for (let i = 0; i <= points; i++) {
        rows.push(`${((i / points) * 100).toFixed(1)}% ${(rand() * 3).toFixed(1)}%`);
      }
      rows.push("100% 100%", "0% 100%");
    } else {
      rows.push("0% 0%", "100% 0%");
      for (let i = points; i >= 0; i--) {
        rows.push(`${((i / points) * 100).toFixed(1)}% ${(100 - rand() * 3).toFixed(1)}%`);
      }
    }
    return `polygon(${rows.join(",")})`;
  }, [seed, edges]);

  return (
    <div className={className} style={{ clipPath, WebkitClipPath: clipPath }}>
      {children}
    </div>
  );
}
