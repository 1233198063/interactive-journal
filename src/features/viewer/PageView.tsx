import { motion } from "framer-motion";
import type { Page } from "../journal/types";
import { BlockView } from "./BlockView";

interface PageViewProps {
  page: Page;
  accent: string;
}

/**
 * Renders one journal page. Blocks are absolutely positioned using their
 * percentage-based placement, then given a slight rotation for the handmade,
 * scrapbook-like feel. Blocks stagger in as the page settles.
 */
export function PageView({ page, accent }: PageViewProps) {
  return (
    <div className="paper-grain relative h-full w-full overflow-hidden">
      {page.blocks.map((block, i) => {
        const p = block.placement;
        return (
          <motion.div
            key={block.id}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.width ?? 70}%`,
              zIndex: p.z ?? 1,
              translateX: "-50%",
              translateY: "-50%",
              rotate: `${p.rotate ?? 0}deg`,
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.15 + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <BlockView block={block} accent={accent} />
          </motion.div>
        );
      })}
    </div>
  );
}
