"use client";

import { cn } from "@/lib/cn";
import { validateDesignFile } from "@/lib/image-utils";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { useUploadThing } from "@/lib/uploadthing";
import { ImagePlus, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

type UploadEndpoint = keyof OurFileRouter;

type ImageUploadZoneProps = {
  endpoint: UploadEndpoint;
  label: string;
  hint?: string;
  optional?: boolean;
  compact?: boolean;
  value: string;
  onChange: (url: string) => void;
  onError?: (message: string) => void;
};

export function ImageUploadZone({
  endpoint,
  label,
  hint = "PNG, JPG, WebP · 50MB max",
  optional,
  compact = false,
  value,
  onChange,
  onError,
}: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    uploadProgressGranularity: "fine",
    onUploadProgress: (pct) => {
      setProgress(Math.round(pct));
    },
    onClientUploadComplete: (files) => {
      const url = files[0]?.url;
      setProgress(100);
      if (url) onChange(url);
      window.setTimeout(() => setProgress(0), 400);
    },
    onUploadError: (error) => {
      setProgress(0);
      onError?.(error.message);
    },
  });

  const uploadFile = useCallback(
    async (file: File) => {
      const validationError = validateDesignFile(file);
      if (validationError) {
        onError?.(validationError);
        return;
      }
      setProgress(0);
      await startUpload([file]);
    },
    [onError, startUpload],
  );

  const previewClass = compact
    ? "relative mt-2 h-28 w-full overflow-hidden border border-brand/15 bg-brand/[0.03] sm:h-32"
    : "relative mt-2 aspect-[3/4] overflow-hidden border border-brand/15 bg-brand/[0.03]";

  const dropzoneClass = compact
    ? "mt-2 flex h-28 w-full flex-col items-center justify-center gap-2 border border-dashed px-3 text-center sm:h-32"
    : "mt-2 flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 border border-dashed px-4 text-center";

  if (value) {
    return (
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/60">
          {label}
          {optional ? (
            <span className="ml-1 font-normal normal-case tracking-normal text-brand/40">
              (optional)
            </span>
          ) : null}
        </p>
        <div className={previewClass}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-full w-full object-contain" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-white/95 text-brand shadow-sm"
            aria-label={`Remove ${label}`}
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/60">
        {label}
        {optional ? (
          <span className="ml-1 font-normal normal-case tracking-normal text-brand/40">
            (optional)
          </span>
        ) : null}
      </p>
      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) void uploadFile(file);
        }}
        className={cn(
          dropzoneClass,
          "transition-colors",
          dragging
            ? "border-brand bg-brand/[0.04]"
            : "border-brand/25 hover:border-brand/45 hover:bg-brand/[0.02]",
          isUploading && "pointer-events-none",
        )}
      >
        <ImagePlus
          className={cn("text-brand/45", compact ? "h-5 w-5" : "h-8 w-8")}
          strokeWidth={1.25}
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand/55">
          {isUploading ? `Uploading ${progress}%` : "Upload image"}
        </span>
        {!isUploading ? (
          <span className="text-[10px] text-brand/40">{hint}</span>
        ) : null}
        {isUploading ? (
          <div className="mt-1 h-1 w-full max-w-[200px] overflow-hidden bg-brand/10">
            <div
              className="h-full bg-brand transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void uploadFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
