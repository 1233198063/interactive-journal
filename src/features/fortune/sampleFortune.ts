import type { FortuneJarConfig } from "../journal/types";

/**
 * Placeholder fortune-stick content for the MVP.
 *
 * Every `message` is a minimal stand-in ("签 N") — swap it for the real line
 * before sharing. The `// TODO` on each stick says what tone/media it's
 * meant to carry, matching the 6-category breakdown the jar was designed
 * around (10 funny/daily, 8 gentle encouragement, 5 shared memories,
 * 3 music, 2 happiness-forward, 2 special gifts).
 */
export const sampleFortune: FortuneJarConfig = {
  sticks: [
    // ---- 10 搞笑 / 日常 (funny / everyday) ----
    { id: "fs-funny-1", category: "funny", content: { format: "text", message: "签 1" } }, // TODO: an inside joke or silly daily observation
    { id: "fs-funny-2", category: "funny", content: { format: "text", message: "签 2" } }, // TODO
    { id: "fs-funny-3", category: "funny", content: { format: "text", message: "签 3" } }, // TODO
    { id: "fs-funny-4", category: "funny", content: { format: "text", message: "签 4" } }, // TODO
    { id: "fs-funny-5", category: "funny", content: { format: "text", message: "签 5" } }, // TODO
    { id: "fs-funny-6", category: "funny", content: { format: "text", message: "签 6" } }, // TODO
    { id: "fs-funny-7", category: "funny", content: { format: "text", message: "签 7" } }, // TODO
    { id: "fs-funny-8", category: "funny", content: { format: "text", message: "签 8" } }, // TODO
    { id: "fs-funny-9", category: "funny", content: { format: "text", message: "签 9" } }, // TODO
    { id: "fs-funny-10", category: "funny", content: { format: "text", message: "签 10" } }, // TODO

    // ---- 8 温柔鼓励 (gentle encouragement) ----
    { id: "fs-encourage-1", category: "encourage", content: { format: "text", message: "签 11" } }, // TODO: a soft, encouraging line
    { id: "fs-encourage-2", category: "encourage", content: { format: "text", message: "签 12" } }, // TODO
    { id: "fs-encourage-3", category: "encourage", content: { format: "text", message: "签 13" } }, // TODO
    { id: "fs-encourage-4", category: "encourage", content: { format: "text", message: "签 14" } }, // TODO
    { id: "fs-encourage-5", category: "encourage", content: { format: "text", message: "签 15" } }, // TODO
    { id: "fs-encourage-6", category: "encourage", content: { format: "text", message: "签 16" } }, // TODO
    { id: "fs-encourage-7", category: "encourage", content: { format: "text", message: "签 17" } }, // TODO
    { id: "fs-encourage-8", category: "encourage", content: { format: "text", message: "签 18" } }, // TODO

    // ---- 5 共同回忆 (shared memories — mostly photos, a couple of clips) ----
    { id: "fs-memory-1", category: "memory", content: { format: "photo", src: "", alt: "", caption: "签 19" } }, // TODO: replace src/alt/caption with a real photo
    { id: "fs-memory-2", category: "memory", content: { format: "photo", src: "", alt: "", caption: "签 20" } }, // TODO
    { id: "fs-memory-3", category: "memory", content: { format: "photo", src: "", alt: "", caption: "签 21" } }, // TODO
    { id: "fs-memory-4", category: "memory", content: { format: "video", src: "", caption: "签 22" } }, // TODO: replace src with a real video clip
    { id: "fs-memory-5", category: "memory", content: { format: "video", src: "", caption: "签 23" } }, // TODO

    // ---- 3 音乐 (music) ----
    { id: "fs-music-1", category: "music", content: { format: "audio", src: "", caption: "签 24" } }, // TODO: replace src with a real audio clip
    { id: "fs-music-2", category: "music", content: { format: "audio", src: "", caption: "签 25" } }, // TODO
    { id: "fs-music-3", category: "music", content: { format: "audio", src: "", caption: "签 26" } }, // TODO

    // ---- 2 幸福传递 (pass the happiness forward) ----
    { id: "fs-happiness-1", category: "happiness", content: { format: "gift", message: "签 27" } }, // TODO: a line that asks them to pass something kind on
    { id: "fs-happiness-2", category: "happiness", content: { format: "gift", message: "签 28" } }, // TODO

    // ---- 2 来自你的特别礼物 (a special gift from you) ----
    { id: "fs-gift-1", category: "gift", content: { format: "gift", message: "签 29", redeemable: "" } }, // TODO: message + what the gift actually is
    { id: "fs-gift-2", category: "gift", content: { format: "gift", message: "签 30", redeemable: "" } }, // TODO
  ],

  hiddenSticks: [
    {
      id: "fs-hidden-birthday",
      category: "gift",
      content: { format: "gift", message: "生日快乐！这是专属于今天的签。" }, // TODO: a real birthday-only message
      unlock: { kind: "birthday" },
    },
    {
      id: "fs-hidden-night",
      category: "encourage",
      content: { format: "text", message: "夜深了，这支签只有晚上才会出现。" }, // TODO: a real late-night message
      unlock: { kind: "night", startHour: 21, endHour: 6 },
    },
    {
      id: "fs-hidden-streak",
      category: "memory",
      content: { format: "text", message: "你已经连续好几天来看这个签筒了，这支签是给你的。" }, // TODO: a real "you kept coming back" message
      unlock: { kind: "streak", days: 3 },
    },
  ],
};
