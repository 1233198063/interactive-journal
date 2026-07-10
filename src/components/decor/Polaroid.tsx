import type { ReactNode } from "react";

interface PolaroidProps {
  src: string;
  alt: string;
  caption?: string;
  children?: ReactNode;
}

/** A photo mounted like an instant-camera print, with room for a caption below. */
export function Polaroid({ src, alt, caption }: PolaroidProps) {
  return (
    <figure className="bg-white pt-2 px-2 pb-4 shadow-[var(--shadow-paper)]">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="block aspect-square w-full rounded-[1px] object-cover"
      />
      {caption && (
        <figcaption
          className="mt-2 text-center text-[var(--color-ink-soft)]"
          style={{ fontFamily: "var(--font-hand)", fontSize: "1.3rem" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
