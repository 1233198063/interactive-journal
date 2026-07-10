import type { Variants } from "framer-motion";

/**
 * A small pool of entrance styles so blocks don't all fade up identically.
 * Picking is deterministic per id (stable across re-renders, no layout jump).
 */
const pool: Variants[] = [
  { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } },
  { hidden: { opacity: 0, y: -14 }, show: { opacity: 1, y: 0 } },
  { hidden: { opacity: 0, x: -18, rotate: -6 }, show: { opacity: 1, x: 0, rotate: 0 } },
  { hidden: { opacity: 0, x: 18, rotate: 6 }, show: { opacity: 1, x: 0, rotate: 0 } },
  { hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } },
];

function hash(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function entranceFor(id: string): Variants {
  return pool[hash(id) % pool.length];
}
