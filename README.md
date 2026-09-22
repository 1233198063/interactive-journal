# Unfold

> A collaborative interactive journal where memories are handcrafted together.

Not just a card. Not just a notebook. A living memory.

## Status

MVP scaffold — **Version 1: a shareable interactive birthday journal.**

Working today:

- 🎁 **Gift-opening** ritual (tap to unwrap → hand-off to the journal)
- 📖 **Paged viewer** with a page-turn animation and page indicators
- ✉️ **Interactive envelopes** — tap to lift the flap and reveal a hidden note
- 🖼️ Photos with handwritten captions, washi-tape text notes
- 🎧 **Audio notes** with a play/pause tape-player widget
- 🪄 **Fortune jar** — shake (or tap) a hand-drawn bucket to draw one of 30
  sticks, plus 3 hidden sticks (birthday-only, night-only, streak-only)
- 📱 Mobile-first, handmade "paper" aesthetic

Author-only local tool (never shipped in the shared journal link): visit
`npm run dev` then `http://localhost:5173/?tool=sticker` for a **sticker
maker** — upload a photo, pick a cartoon/sketch filter and a white-border
cutout or plain square sticker style, and download a PNG to hand-place into
`sampleJournal.ts`. The cutout style downloads a ~40MB in-browser background-
removal model on first use (cached afterward); no image ever leaves the
browser.

Deferred by design (per the MVP): auth, AI, marketplace, templates,
real-time collaboration, comments, notifications.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

## Where things live

```
src/
  app/                 App shell + stage machine (gift → journal)
  pages/               Route-level screens (reserved)
  features/
    journal/           Domain model, sample content, theme tokens
      types.ts         The serializable Journal / Page / Block model
      sampleJournal.ts Hardcoded MVP content (data loader TBD)
    builder/           Journal editor (future)
    viewer/            The reading experience (gift, pages, envelopes, audio)
    collaboration/     Multi-author features (future)
  components/          Shared presentational components
  hooks/               Reusable React hooks
  services/            Data loading / API clients (future)
  utils/               Helpers
  assets/              Static assets
```

## Data model

Everything the viewer renders is described by the `Journal` type in
`src/features/journal/types.ts`. Content is plain, serializable JSON, so the
current hardcoded `sampleJournal` can later be swapped for a file loader,
localStorage, or a backend without touching the viewer.

## Design principle

Every interaction should answer one question:

> Does this make people feel closer?

If not, don't build it.
