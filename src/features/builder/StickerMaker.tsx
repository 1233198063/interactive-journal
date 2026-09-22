import { useState, type ChangeEvent } from "react";
import {
  canvasToPngBlob,
  downloadBlob,
  drawImageToCanvas,
  loadImageFromBlob,
  loadImageFromFile,
} from "./canvasUtils";
import { applyCartoonStyle, type ConversionStyle } from "./cartoonFilters";
import { addSquareFrame, addWhiteBorder, removeImageBackground } from "./stickerCutout";

type StickerStyleOption = "square" | "cutout";
type Status = "idle" | "loading" | "done" | "error";

const MAX_DIMENSION = 900;

/**
 * Author-only local tool: upload a photo, pick a conversion style and a
 * sticker style, then download a PNG to hand-place into the journal data.
 * Never linked from the shared gift/journal flow — reached via `?tool=sticker`.
 */
export function StickerMaker() {
  const [sourceCanvas, setSourceCanvas] = useState<HTMLCanvasElement | null>(null);
  const [conversionStyle, setConversionStyle] = useState<ConversionStyle>("photo");
  const [stickerStyle, setStickerStyle] = useState<StickerStyleOption>("square");
  const [resultCanvas, setResultCanvas] = useState<HTMLCanvasElement | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [statusText, setStatusText] = useState("");

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = await loadImageFromFile(file);
    setSourceCanvas(drawImageToCanvas(img, MAX_DIMENSION));
    setResultCanvas(null);
    setResultUrl(null);
    setStatus("idle");
    setStatusText("");
  }

  async function generate() {
    if (!sourceCanvas) return;
    setStatus("loading");
    setStatusText(stickerStyle === "cutout" ? "首次使用需要下载抠图模型（约 40MB）…" : "生成中…");

    try {
      let working: HTMLCanvasElement;

      if (stickerStyle === "cutout") {
        const sourceBlob = await canvasToPngBlob(sourceCanvas);
        const cutoutBlob = await removeImageBackground(sourceBlob, (key, current, total) => {
          const pct = total ? Math.round((current / total) * 100) : 0;
          setStatusText(`处理中 (${key}) ${pct}%`);
        });
        const cutoutImg = await loadImageFromBlob(cutoutBlob);
        working = document.createElement("canvas");
        working.width = cutoutImg.width;
        working.height = cutoutImg.height;
        working.getContext("2d")?.drawImage(cutoutImg, 0, 0);
      } else {
        working = document.createElement("canvas");
        working.width = sourceCanvas.width;
        working.height = sourceCanvas.height;
        working.getContext("2d")?.drawImage(sourceCanvas, 0, 0);
      }

      const ctx = working.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D context unavailable");
      applyCartoonStyle(ctx, working.width, working.height, conversionStyle);

      const final =
        stickerStyle === "cutout"
          ? addWhiteBorder(working, working.width, working.height, 14)
          : addSquareFrame(working, working.width, working.height, 24);

      setResultCanvas(final);
      setResultUrl(final.toDataURL("image/png"));
      setStatus("done");
      setStatusText("完成");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setStatusText("生成失败，换一张图片再试试");
    }
  }

  function download() {
    if (!resultCanvas) return;
    resultCanvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, "sticker.png");
    }, "image/png");
  }

  return (
    <div
      className="mx-auto flex min-h-full max-w-lg flex-col gap-6 px-4 py-8"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div>
        <p className="text-2xl" style={{ fontFamily: "var(--font-hand)", color: "var(--color-ink)" }}>
          贴纸制作工具
        </p>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          仅本地使用：上传照片 → 选风格 → 下载 PNG → 手动放进 sampleJournal.ts。
        </p>
      </div>

      <label
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed py-8 text-sm text-[var(--color-ink-soft)]"
        style={{ borderColor: "var(--color-paper-shadow)" }}
      >
        {sourceCanvas ? "重新选择照片" : "点击上传照片"}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>

      {sourceCanvas && (
        <img
          src={sourceCanvas.toDataURL("image/png")}
          alt="原图预览"
          className="mx-auto max-h-64 rounded-[3px] object-contain shadow-[var(--shadow-paper)]"
        />
      )}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium text-[var(--color-ink)]">转化风格</legend>
        <RadioRow
          name="conversion-style"
          value={conversionStyle}
          onChange={setConversionStyle}
          options={[
            { value: "photo", label: "保留真实照片" },
            { value: "cartoon", label: "卡通滤镜（色块 + 描边）" },
            { value: "sketch", label: "素描线稿" },
          ]}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium text-[var(--color-ink)]">贴纸样式</legend>
        <RadioRow
          name="sticker-style"
          value={stickerStyle}
          onChange={setStickerStyle}
          options={[
            { value: "square", label: "方形贴纸（白色留白边框，不抠图）" },
            { value: "cutout", label: "白边抠图贴纸（自动去背景，首次约 40MB 模型下载）" },
          ]}
        />
      </fieldset>

      <button
        type="button"
        onClick={generate}
        disabled={!sourceCanvas || status === "loading"}
        className="cursor-pointer rounded-full px-5 py-2.5 text-white shadow-[var(--shadow-paper)] disabled:cursor-default disabled:opacity-40"
        style={{ backgroundColor: "var(--color-dusk)" }}
      >
        生成贴纸
      </button>

      {statusText && <p className="text-sm text-[var(--color-ink-soft)]">{statusText}</p>}

      {resultUrl && (
        <div className="flex flex-col items-center gap-3">
          <img src={resultUrl} alt="贴纸预览" className="max-h-72 object-contain" />
          <button
            type="button"
            onClick={download}
            className="cursor-pointer rounded-full px-5 py-2 text-sm text-white shadow-[var(--shadow-paper)]"
            style={{ backgroundColor: "var(--color-sage)" }}
          >
            下载贴纸 PNG
          </button>
        </div>
      )}
    </div>
  );
}

function RadioRow<T extends string>({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {options.map((opt) => (
        <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-ink)]">
          <input type="radio" name={name} checked={value === opt.value} onChange={() => onChange(opt.value)} />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
