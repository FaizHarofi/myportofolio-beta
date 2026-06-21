"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Camera, Upload, X, ZoomIn, Loader2 } from "lucide-react";

const PREVIEW_SIZE = 160;
const OUTPUT_SIZE = 256;

export function AvatarCropper({
  action,
  currentAvatar,
  initials,
}: {
  action: (formData: FormData) => Promise<void>;
  currentAvatar: string | null;
  initials: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const imgLoadedRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!file) {
      setPreview(null);
      imgLoadedRef.current = false;
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const onImgLoad = useCallback(() => {
    imgLoadedRef.current = true;
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!preview) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    offsetStart.current = { ...offset };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset({
      x: offsetStart.current.x + dx,
      y: offsetStart.current.y + dy,
    });
  };

  const onMouseUp = () => setDragging(false);

  const reset = () => {
    setFile(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const cropAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !imgLoadedRef.current || !imgRef.current || !canvasRef.current)
      return;

    setUploading(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      // Clip to circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
      ctx.clip();

      // Compute source rectangle from original image
      const img = imgRef.current;
      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;
      const minDim = Math.min(imgW, imgH);
      const srcSize = minDim / zoom;
      const srcX =
        (imgW - srcSize) / 2 - (offset.x * srcSize) / PREVIEW_SIZE;
      const srcY =
        (imgH - srcSize) / 2 - (offset.y * srcSize) / PREVIEW_SIZE;

      ctx.drawImage(
        img,
        srcX,
        srcY,
        srcSize,
        srcSize,
        0,
        0,
        OUTPUT_SIZE,
        OUTPUT_SIZE
      );
      ctx.restore();

      // Convert canvas to blob → File → FormData
      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
          "image/png"
        );
      });

      const croppedFile = new File([blob], "avatar.png", {
        type: "image/png",
      });
      const formData = new FormData();
      formData.append("file", croppedFile);

      await action(formData);
    } catch (err: any) {
      if (err?.message?.includes?.("NEXT_REDIRECT")) throw err;
      console.error("AvatarCropper submit:", err);
    } finally {
      setUploading(false);
    }
  };

  // --- Render ---

  if (!preview) {
    return (
      <div className="flex items-center gap-5">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-sky-500 via-violet-500 to-fuchsia-500 p-[3px] shadow-lg shadow-violet-500/20">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-950">
            {currentAvatar ? (
              <img
                src={currentAvatar}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-white">
                {initials || "?"}
              </span>
            )}
          </div>
        </div>

        <label
          htmlFor="avatar-file"
          className="group flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/15 bg-slate-900/40 px-4 py-3 text-sm text-slate-400 transition hover:border-violet-400/40 hover:bg-violet-500/5"
        >
          <Camera
            size={16}
            className="text-slate-500 group-hover:text-violet-300 transition"
          />
          <span>Choose image file…</span>
          <input
            id="avatar-file"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onFileChange}
            className="sr-only"
          />
        </label>
      </div>
    );
  }

  // Cropper mode — file selected, show circular preview with zoom + pan
  return (
    <form ref={formRef} onSubmit={cropAndSubmit} className="space-y-4">
      <div className="flex items-start gap-6">
        {/* Circular cropper */}
        <div
          className="relative shrink-0 select-none overflow-hidden rounded-full border-2 border-violet-400/50 shadow-lg shadow-violet-500/20"
          style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* Checkerboard / dark bg */}
          <div className="absolute inset-0 bg-slate-950" />

          <img
            ref={imgRef}
            src={preview}
            alt="avatar preview"
            onLoad={onImgLoad}
            className="absolute inset-0 h-full w-full object-cover select-none"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            }}
            draggable={false}
          />

          {/* Circle guide overlay */}
          <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />

          {/* Drag hint */}
          {!dragging && (
            <div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] text-white/80">
              drag to reposition
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                <ZoomIn size={12} />
                Zoom
              </label>
              <span className="font-mono text-[10px] text-slate-500">
                {zoom.toFixed(2)}×
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="mt-1.5 w-full accent-violet-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-4 py-2 text-xs font-medium text-white shadow-md shadow-violet-500/25 hover:shadow-violet-500/40 hover:brightness-110 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload size={13} />
                  Upload avatar
                </>
              )}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <X size={13} />
              Cancel
            </button>
          </div>

          <p className="text-[10px] text-slate-500">
            Drag the image to position your face. Use the slider to zoom. The
            crop is circular — what you see is what gets uploaded.
          </p>
        </div>
      </div>

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />
      {/* Hidden input (not used for submission, just for accessibility) */}
      <input
        ref={hiddenInputRef}
        type="file"
        name="file"
        className="sr-only"
        tabIndex={-1}
      />
    </form>
  );
}
