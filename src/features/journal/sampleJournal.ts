import type { Journal } from "./types";

/**
 * Hardcoded sample content for the MVP.
 *
 * NOTE: the data-loading strategy (static file vs. in-app builder vs. backend)
 * is intentionally deferred. Everything the viewer needs is described by the
 * `Journal` type, so swapping this constant for a real loader later is a
 * localized change.
 */
export const sampleJournal: Journal = {
  id: "sample-birthday",
  title: "Happy Birthday, Mia",
  recipient: "Mia",
  authors: ["Yue", "The gang"],
  theme: "blush",
  coverMessage: "A little something we made, page by page.",
  pages: [
    {
      id: "p1",
      label: "Welcome",
      blocks: [
        {
          id: "p1-title",
          kind: "text",
          content: "You made it another trip around the sun ☀️",
          font: "hand",
          tape: true,
          placement: { x: 50, y: 22, rotate: -2, width: 78, z: 2 },
        },
        {
          id: "p1-note",
          kind: "text",
          content:
            "We couldn't all be in the same room this year, so we built you one instead. Turn the pages — there's more than it looks.",
          font: "serif",
          placement: { x: 50, y: 55, rotate: 1, width: 72 },
        },
        {
          id: "p1-env",
          kind: "envelope",
          frontLabel: "Open me first",
          message:
            "Twelve months ago you told us you wanted a quieter, braver year. You did it. We're so proud of you. 💛",
          placement: { x: 50, y: 80, rotate: -3, width: 60, z: 3 },
        },
      ],
    },
    {
      id: "p2",
      label: "That trip",
      blocks: [
        {
          id: "p2-photo",
          kind: "image",
          src: "https://images.unsplash.com/photo-1503457574462-bd27054394c1?w=640&q=70",
          alt: "Two friends laughing by the sea at sunset",
          caption: "the ferry we almost missed",
          placement: { x: 42, y: 40, rotate: -4, width: 62, z: 1 },
        },
        {
          id: "p2-note",
          kind: "text",
          content: "still the best worst-planned weekend of my life",
          font: "hand",
          tape: true,
          placement: { x: 66, y: 74, rotate: 4, width: 50, z: 2 },
        },
      ],
    },
    {
      id: "p3",
      label: "A voice note",
      blocks: [
        {
          id: "p3-note",
          kind: "text",
          content: "press play — turn it up 🎧",
          font: "hand",
          placement: { x: 50, y: 30, rotate: -1, width: 60 },
        },
        {
          id: "p3-audio",
          kind: "audio",
          // Replace with your own hosted recording.
          src: "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3",
          label: "Everyone says happy birthday",
          placement: { x: 50, y: 58, rotate: 2, width: 74, z: 2 },
        },
        {
          id: "p3-env",
          kind: "envelope",
          frontLabel: "For later",
          message:
            "Open this again next year. We'll have added a new page by then. This journal doesn't end. 🌱",
          placement: { x: 50, y: 84, rotate: -2, width: 58, z: 3 },
        },
      ],
    },
  ],
};
