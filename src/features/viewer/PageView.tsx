import { motion } from "framer-motion";
import type { Page, Placement } from "../journal/types";
import { BlockView } from "./BlockView";
import { DecorationView } from "./DecorationView";
import { entranceFor } from "./entranceVariants";

interface PageViewProps {
  page: Page;
  accent: string;
}

function positionStyle(p: Placement) {
  return {
    left: `${p.x}%`,
    top: `${p.y}%`,
    width: `${p.width ?? 70}%`,
    zIndex: p.z ?? 1,
    transform: `translate(-50%, -50%) rotate(${p.rotate ?? 0}deg)`,
  } as const;
}

/**
 * Renders one journal page. Blocks and decorations are absolutely positioned
 * using their percentage-based placement. Each item settles into its final
 * (fixed) tilt while an inner wrapper plays one of a few varied entrance
 * styles, so the page doesn't feel like everything fades up identically.
 */
export function PageView({ page, accent }: PageViewProps) {
  const blockCount = page.blocks.length;

  return (
    <div className="paper-grain relative h-full w-full overflow-hidden">
      {page.blocks.map((block, i) => (
        <div key={block.id} className="absolute" style={positionStyle(block.placement)}>
          <motion.div
            variants={entranceFor(block.id)}
            initial="hidden"
            animate="show"
            transition={{
              duration: 0.5,
              delay: 0.15 + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <BlockView block={block} accent={accent} />
          </motion.div>
        </div>
      ))}

      {page.decorations?.map((decoration, i) => (
        <div
          key={decoration.id}
          className="absolute"
          style={positionStyle(decoration.placement)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 14,
              delay: 0.4 + blockCount * 0.12 + i * 0.08,
            }}
          >
            <DecorationView decoration={decoration} />
          </motion.div>
        </div>
      ))}
    </div>
  );
}
