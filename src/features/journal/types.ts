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
  /**
   * Purely ornamental scrapbook flair — stickers, tape, pins, doodles.
   * Separate from `blocks` because decorations carry no content, so a page
   * can be dressed up without touching the reading experience.
   */
  decorations?: Decoration[];
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
  /** Decorative washi tape strip behind/over the note. Defaults to "solid". */
  tape?: boolean | TapeVariant;
}

export interface ImageBlock extends BaseBlock {
  kind: "image";
  src: string;
  alt: string;
  caption?: string;
  /** How the photo is mounted on the page. Defaults to "plain". */
  frame?: "plain" | "polaroid" | "torn";
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

// ---------------------------------------------------------------------------
// Decorations — ornamental scrapbook flair, no reading content of their own.
// ---------------------------------------------------------------------------

export type TapeVariant = "solid" | "stripe" | "dot" | "gingham";

export type Decoration =
  | TapeDecoration
  | StickerDecoration
  | PinDecoration
  | DoodleDecoration;

interface BaseDecoration {
  id: string;
  placement: Placement;
}

export interface TapeDecoration extends BaseDecoration {
  kind: "tape";
  variant?: TapeVariant;
  color?: string;
}

/** An emoji-based sticker — cheap to author, easy to make more of. */
export interface StickerDecoration extends BaseDecoration {
  kind: "sticker";
  emoji: string;
}

export interface PinDecoration extends BaseDecoration {
  kind: "pin";
  variant?: "pin" | "paperclip";
}

export type DoodleShape = "heart" | "star" | "swirl" | "arrow" | "sparkle";

export interface DoodleDecoration extends BaseDecoration {
  kind: "doodle";
  shape: DoodleShape;
  color?: string;
}
