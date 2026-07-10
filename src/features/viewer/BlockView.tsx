import type { Block } from "../journal/types";
import { Envelope } from "./Envelope";
import { AudioNote } from "./AudioNote";
import { Tape } from "@/components/decor/Tape";
import { Polaroid } from "@/components/decor/Polaroid";
import { TornEdge } from "@/components/decor/TornEdge";

interface BlockViewProps {
  block: Block;
  accent: string;
}

/** Renders a single block by kind. Positioning is handled by the parent Page. */
export function BlockView({ block, accent }: BlockViewProps) {
  switch (block.kind) {
    case "text": {
      const tapeVariant = block.tape === true ? "solid" : block.tape || undefined;
      return (
        <div className="relative">
          {tapeVariant && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Tape variant={tapeVariant} rotate={-3} />
            </div>
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
    }

    case "image": {
      if (block.frame === "polaroid") {
        return <Polaroid src={block.src} alt={block.alt} caption={block.caption} />;
      }

      const photo = (
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

      if (block.frame === "torn") {
        return (
          <TornEdge seed={block.id} className="bg-white p-2 shadow-[var(--shadow-paper)]">
            <img
              src={block.src}
              alt={block.alt}
              loading="lazy"
              className="block w-full object-cover"
            />
            {block.caption && (
              <figcaption
                className="mt-1.5 text-center text-lg text-[var(--color-ink-soft)]"
                style={{ fontFamily: "var(--font-hand)" }}
              >
                {block.caption}
              </figcaption>
            )}
          </TornEdge>
        );
      }

      return photo;
    }

    case "audio":
      return <AudioNote block={block} accent={accent} />;

    case "envelope":
      return <Envelope block={block} accent={accent} />;
  }
}
