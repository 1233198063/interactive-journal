interface PinProps {
  variant?: "pin" | "paperclip";
  size?: number;
  color?: string;
}

/** A small SVG pin or paperclip, purely decorative — sits at a block's corner. */
export function Pin({ variant = "pin", size = 26, color = "var(--color-blush)" }: PinProps) {
  if (variant === "paperclip") {
    return (
      <svg
        aria-hidden
        width={size}
        height={size * 1.5}
        viewBox="0 0 20 30"
        fill="none"
      >
        <path
          d="M6 8v14a4 4 0 0 0 8 0V6a2.5 2.5 0 0 0-5 0v13a1 1 0 0 0 2 0V8"
          stroke="var(--color-ink-soft)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="7" fill={color} stroke="rgba(0,0,0,0.08)" />
      <path d="M12 15.5 L12 22" stroke="var(--color-ink-soft)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="9.5" cy="7" r="1.6" fill="rgba(255,255,255,0.55)" />
    </svg>
  );
}
