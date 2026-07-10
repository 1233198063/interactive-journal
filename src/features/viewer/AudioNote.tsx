import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { AudioBlock } from "../journal/types";

interface AudioNoteProps {
  block: AudioBlock;
  accent: string;
}

/** A small tape-player-styled audio widget with a play/pause control. */
export function AudioNote({ block, accent }: AudioNoteProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnd = () => setPlaying(false);
    el.addEventListener("ended", onEnd);
    return () => el.removeEventListener("ended", onEnd);
  }, []);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 shadow-[var(--shadow-paper)]"
      style={{ backgroundColor: "var(--color-paper-deep)" }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="flex h-12 w-12 flex-none cursor-pointer items-center justify-center rounded-full text-white shadow-md outline-none"
        style={{ backgroundColor: accent }}
      >
        {playing ? (
          <span className="text-lg">❚❚</span>
        ) : (
          <span className="ml-0.5 text-lg">▶</span>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--color-ink)]">
          {block.label}
        </p>
        {/* Playful "sound wave" */}
        <div className="mt-1.5 flex h-4 items-end gap-[3px]">
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full"
              style={{ backgroundColor: "var(--color-ink-soft)" }}
              animate={
                playing
                  ? { height: [4, 14, 6, 16, 5][i % 5] }
                  : { height: 4 }
              }
              transition={{
                duration: 0.5,
                repeat: playing ? Infinity : 0,
                repeatType: "reverse",
                delay: (i % 5) * 0.08,
              }}
            />
          ))}
        </div>
      </div>

      <audio ref={audioRef} src={block.src} preload="none" />
    </div>
  );
}
