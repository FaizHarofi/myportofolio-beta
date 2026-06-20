"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";

export type FileInputProps = {
  id?: string;
  name: string;
  accept?: string;
  required?: boolean;
  variant?: "icon" | "cover";
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function FileInput({
  id,
  name,
  accept,
  required,
  variant = "cover",
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const isImage =
    file?.type.startsWith("image/") ||
    (file && /\.(png|jpe?g|webp|svg)$/i.test(file.name));

  useEffect(() => {
    if (!file || !isImage) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, isImage]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null;
    setFile(next);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && inputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(dropped);
      inputRef.current.files = dt.files;
      setFile(dropped);
    }
  };

  const clear = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const toneRing = dragOver
    ? "border-violet-400 bg-violet-500/10"
    : file
    ? "border-emerald-400/50 bg-emerald-500/5"
    : "border-white/15 bg-slate-900/40 hover:border-violet-400/40 hover:bg-violet-500/5";

  const labelText =
    variant === "icon" ? "Choose SVG file..." : "Choose image file...";

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`group relative flex items-center gap-3 rounded-lg border border-dashed px-3 py-2.5 transition cursor-pointer ${toneRing}`}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          name={name}
          accept={accept}
          required={required}
          onChange={onChange}
          className="sr-only"
        />

        {preview ? (
          <div className="h-12 w-12 shrink-0 rounded-md border border-white/10 bg-slate-950 overflow-hidden flex items-center justify-center">
            <img
              src={preview}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
        ) : file ? (
          <div className="h-12 w-12 shrink-0 rounded-md border border-white/10 bg-slate-950 flex items-center justify-center text-slate-400">
            <FileText size={20} />
          </div>
        ) : (
          <div className="h-12 w-12 shrink-0 rounded-md border border-white/10 bg-slate-900/60 flex items-center justify-center text-slate-500 group-hover:text-violet-300 transition">
            <Upload size={20} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          {file ? (
            <>
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  size={13}
                  className="shrink-0 text-emerald-400"
                />
                <p className="truncate text-sm font-medium text-white">
                  {file.name}
                </p>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {formatBytes(file.size)} · ready to upload
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-300">{labelText}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                or drag &amp; drop
              </p>
            </>
          )}
        </div>

        {file ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
            className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-slate-950/30 text-slate-400 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-400/30 transition"
            aria-label="Remove file"
          >
            <X size={13} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
