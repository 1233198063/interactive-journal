/**
 * The Unfold journal data model.
 *
 * A Journal is an ordered collection of Pages. Each Page holds a stack of
 * Blocks — text, images, audio, and interactive widgets (envelopes, etc.).
 * The model is intentionally serializable (plain JSON) so the same shape can
 * later come from a static file, localStorage, or a backend without changing
 * the viewer.
 */

export interface Journal {
  id: string;
  title: string;
  /** Who this journal is for — shown on the cover / gift. */
  recipient: string;
  /** Who made it. */
  authors: string[];
  /** Accent theme for the cover and gift wrapping. */
  theme: JournalTheme;
  coverMessage?: string;
  pages: Page[];
}

export type JournalTheme = "blush" | "sage" | "dusk";

export interface Page {
  id: string;
  /** Optional short label shown in the page indicator. */
  label?: string;
  blocks: Block[];
}

/** Position + rotation of a block on the page, giving the "imperfect" feel. */
export interface Placement {
  /** 0–100, percentage of page width/height. */
  x: number;
  y: number;
  /** Degrees of rotation for the handmade tilt. */
  rotate?: number;
  /** Stacking order. */
  z?: number;
  /** Width as a percentage of the page. */
  width?: number;
}

export type Block = TextBlock | ImageBlock | AudioBlock | EnvelopeBlock;

interface BaseBlock {
  id: string;
  placement: Placement;
}

export interface TextBlock extends BaseBlock {
  kind: "text";
  content: string;
  /** Handwritten vs. printed feel. */
  font?: "hand" | "serif";
  /** Decorative washi tape strip behind/over the note. */
  tape?: boolean;
}

export interface ImageBlock extends BaseBlock {
  kind: "image";
  src: string;
  alt: string;
  caption?: string;
}

export interface AudioBlock extends BaseBlock {
  kind: "audio";
  src: string;
  label: string;
}

/** An envelope the reader opens to reveal a hidden message. */
export interface EnvelopeBlock extends BaseBlock {
  kind: "envelope";
  /** Text on the sealed envelope. */
  frontLabel: string;
  /** The message revealed inside. */
  message: string;
}
