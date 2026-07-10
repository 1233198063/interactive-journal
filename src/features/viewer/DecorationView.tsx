import type { Decoration } from "../journal/types";
import { Tape } from "@/components/decor/Tape";
import { Sticker } from "@/components/decor/Sticker";
import { Pin } from "@/components/decor/Pin";
import { Doodle } from "@/components/decor/Doodle";

interface DecorationViewProps {
  decoration: Decoration;
}

/** Renders a single ornamental piece by kind. Purely visual, no content. */
export function DecorationView({ decoration }: DecorationViewProps) {
  switch (decoration.kind) {
    case "tape":
      // Rotation is already applied by the positioned wrapper in PageView.
      return <Tape variant={decoration.variant} color={decoration.color} rotate={0} />;
    case "sticker":
      return <Sticker emoji={decoration.emoji} />;
    case "pin":
      return <Pin variant={decoration.variant} />;
    case "doodle":
      return <Doodle shape={decoration.shape} color={decoration.color} />;
  }
}
