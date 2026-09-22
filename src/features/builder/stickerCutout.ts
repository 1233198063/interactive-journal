import type { Config } from "@imgly/background-removal";

export type ProgressHandler = (key: string, current: number, total: number) => void;

/**
 * Removes the background from an image, entirely in the browser (no image
 * data leaves the device). `@imgly/background-removal` is dynamically
 * imported so its ~40MB quantized model is only fetched when this function
 * actually runs — never as part of the shared journal's bundle.
 */
export async function removeImageBackground(source: Blob, onProgress?: ProgressHandler): Promise<Blob> {
  const { removeBackground } = await import("@imgly/background-removal");
  const config: Config = {
    model: "isnet_quint8", // smallest quantized model (~40MB) — some artifacts possible
    output: { format: "image/png", quality: 0.9 },
    progress: onProgress,
  };
  return removeBackground(source, config);
}

/**
 * Builds a die-cut sticker look: stamps a white silhouette of `source` at
 * offsets around a circle to form an outline, then draws the real (cutout)
 * image centered on top.
 */
export function addWhiteBorder(
  source: CanvasImageSource,
  width: number,
  height: number,
  borderWidth = 14
): HTMLCanvasElement {
  const silhouette = document.createElement("canvas");
  silhouette.width = width;
  silhouette.height = height;
  const sctx = silhouette.getContext("2d");
  if (!sctx) throw new Error("Canvas 2D context unavailable");
  sctx.drawImage(source, 0, 0, width, height);
  sctx.globalCompositeOperation = "source-in";
  sctx.fillStyle = "#ffffff";
  sctx.fillRect(0, 0, width, height);

  const canvas = document.createElement("canvas");
  canvas.width = width + borderWidth * 2;
  canvas.height = height + borderWidth * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const steps = 32;
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const dx = borderWidth + Math.cos(angle) * borderWidth;
    const dy = borderWidth + Math.sin(angle) * borderWidth;
    ctx.drawImage(silhouette, dx, dy);
  }
  ctx.drawImage(source, borderWidth, borderWidth, width, height);
  return canvas;
}

/** A simple white-margin "print" frame for the non-cutout sticker style. */
export function addSquareFrame(
  source: CanvasImageSource,
  width: number,
  height: number,
  padding = 24
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width + padding * 2;
  canvas.height = height + padding * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, padding, padding, width, height);
  return canvas;
}
