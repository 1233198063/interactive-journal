import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import type { FortuneContent } from "../journal/types";

interface StickRevealProps {
  content: FortuneContent;
  isHidden: boolean;
  onClose: () => void;
}

/** The drawn stick, enlarged and unrolled — portaled so it's never clipped. */
export function StickReveal({ content, isHidden, onClose }: StickRevealProps) {
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[var(--color-ink)]/30 p-6 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[80vh] w-full max-w-sm overflow-y-auto rounded-[4px] bg-white px-6 py-6 text-center shadow-[var(--shadow-lift)]"
      >
        {isHidden && (
          <p className="mb-3 text-sm tracking-wide" style={{ color: "var(--color-dusk)" }}>
            ✨ 隐藏签 ✨
          </p>
        )}

        <FortuneContentView content={content} />

        <button
          type="button"
          onClick={onClose}
          className="mt-6 cursor-pointer text-sm text-[var(--color-ink-soft)] underline"
        >
          再抽一支
        </button>
      </motion.div>
    </motion.div>,
    document.body
  );
}

function FortuneContentView({ content }: { content: FortuneContent }) {
  switch (content.format) {
    case "text":
      return <FortuneMessage message={content.message} />;

    case "photo":
      return content.src ? (
        <figure>
          <img src={content.src} alt={content.alt} className="mx-auto w-full rounded-[3px] object-cover" />
          {content.caption && <FortuneCaption caption={content.caption} />}
        </figure>
      ) : (
        <PlaceholderBox label={content.caption || "占位照片"} />
      );

    case "video":
      return content.src ? (
        <figure>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video controls className="mx-auto w-full rounded-[3px]" src={content.src} />
          {content.caption && <FortuneCaption caption={content.caption} />}
        </figure>
      ) : (
        <PlaceholderBox label={content.caption || "占位视频"} />
      );

    case "audio":
      return content.src ? (
        <figure>
          <audio controls className="mx-auto w-full" src={content.src} />
          {content.caption && <FortuneCaption caption={content.caption} />}
        </figure>
      ) : (
        <PlaceholderBox label={content.caption || "占位语音"} />
      );

    case "gift":
      return (
        <div>
          <FortuneMessage message={content.message} />
          {content.redeemable && (
            <p
              className="mt-4 inline-block rounded-full px-4 py-1.5 text-sm"
              style={{ backgroundColor: "var(--color-paper-deep)", color: "var(--color-ink-soft)" }}
            >
              🎁 {content.redeemable}
            </p>
          )}
        </div>
      );
  }
}

function FortuneMessage({ message }: { message: string }) {
  return (
    <p
      className="whitespace-pre-line text-xl leading-snug text-[var(--color-ink)]"
      style={{ fontFamily: "var(--font-hand)" }}
    >
      {message}
    </p>
  );
}

function FortuneCaption({ caption }: { caption: string }) {
  return (
    <figcaption
      className="mt-2 text-lg text-[var(--color-ink-soft)]"
      style={{ fontFamily: "var(--font-hand)" }}
    >
      {caption}
    </figcaption>
  );
}

function PlaceholderBox({ label }: { label: string }) {
  return (
    <div
      className="flex h-40 w-full items-center justify-center rounded-[3px] border border-dashed px-4 text-center text-sm"
      style={{ borderColor: "var(--color-paper-shadow)", color: "var(--color-ink-soft)" }}
    >
      {label}
    </div>
  );
}
