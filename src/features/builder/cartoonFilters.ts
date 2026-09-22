/**
 * Pure Canvas 2D "cartoon-ish" filters — posterized color + edge lines, or a
 * pencil-sketch line drawing. No model, no network call: cheap approximations,
 * not true AI style transfer.
 */

export type ConversionStyle = "photo" | "cartoon" | "sketch";

function toGrayscale(data: Uint8ClampedArray, width: number, height: number): Float32Array {
  const gray = new Float32Array(width * height);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    gray[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  return gray;
}

/** Sobel gradient magnitude per pixel — a cheap edge-strength map. */
function sobelMagnitude(gray: Float32Array, width: number, height: number): Float32Array {
  const out = new Float32Array(width * height);
  const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sx = 0;
      let sy = 0;
      let k = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const v = gray[(y + dy) * width + (x + dx)];
          sx += v * gx[k];
          sy += v * gy[k];
          k++;
        }
      }
      out[y * width + x] = Math.sqrt(sx * sx + sy * sy);
    }
  }
  return out;
}

/** Mutates the canvas in place, preserving alpha. "photo" leaves it untouched. */
export function applyCartoonStyle(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  style: ConversionStyle
) {
  if (style === "photo") return;

  const imageData = ctx.getImageData(0, 0, width, height);
  const gray = toGrayscale(imageData.data, width, height);
  const edges = sobelMagnitude(gray, width, height);

  if (style === "cartoon") {
    const levels = 6;
    const step = 255 / (levels - 1);
    const EDGE_THRESHOLD = 50;
    for (let p = 0, i = 0; i < imageData.data.length; i += 4, p++) {
      imageData.data[i] = Math.round(Math.round(imageData.data[i] / step) * step);
      imageData.data[i + 1] = Math.round(Math.round(imageData.data[i + 1] / step) * step);
      imageData.data[i + 2] = Math.round(Math.round(imageData.data[i + 2] / step) * step);
      if (edges[p] > EDGE_THRESHOLD) {
        imageData.data[i] *= 0.3;
        imageData.data[i + 1] *= 0.3;
        imageData.data[i + 2] *= 0.3;
      }
    }
  } else {
    // sketch: white paper, a dark line wherever the edge is strong.
    const EDGE_THRESHOLD = 55;
    for (let p = 0, i = 0; i < imageData.data.length; i += 4, p++) {
      const line = edges[p] > EDGE_THRESHOLD ? Math.max(0, 255 - edges[p]) : 255;
      imageData.data[i] = line;
      imageData.data[i + 1] = line;
      imageData.data[i + 2] = line;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
