import type { Block } from "../journal/types";
import { Envelope } from "./Envelope";
import { AudioNote } from "./AudioNote";

interface BlockViewProps {
  block: Block;
  accent: string;
}

/** Renders a single block by kind. Positioning is handled by the parent Page. */
export function BlockView({ block, accent }: BlockViewProps) {
  switch (block.kind) {
    case "text":
      return (
        <div className="relative">
          {block.tape && (
            <span
              aria-hidden
              className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 rounded-[2px] opacity-80"
              style={{
                backgroundColor: "var(--color-tape)",
                boxShadow: "0 1px 2px rgba(64,56,47,0.15)",
              }}
            />
          )}
          <p
            className="text-center leading-snug text-[var(--color-ink)]"
            style={{
              fontFamily:
                block.font === "hand"
                  ? "var(--font-hand)"
                  : "var(--font-serif)",
              fontSize: block.font === "hand" ? "1.6rem" : "1.05rem",
            }}
          >
            {block.content}
          </p>
        </div>
      );

    case "image":
      return (
        <figure className="rounded-[3px] bg-white p-2 shadow-[var(--shadow-paper)]">
          <img
            src={block.src}
            alt={block.alt}
            loading="lazy"
            className="block w-full rounded-[2px] object-cover"
          />
          {block.caption && (
            <figcaption
              className="mt-1.5 text-center text-lg text-[var(--color-ink-soft)]"
              style={{ fontFamily: "var(--font-hand)" }}
            >
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "audio":
      return <AudioNote block={block} accent={accent} />;

    case "envelope":
      return <Envelope block={block} accent={accent} />;
  }
}
