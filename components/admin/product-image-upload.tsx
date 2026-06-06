"use client";

import { cn } from "@/lib/cn";
import { readFileAsDataUrl, validateDesignFile } from "@/lib/image-utils";
import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";

type ProductImageUploadProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
};

function ProductImageSlot({
  label,
  value,
  onChange,
  optional,
}: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File) {
    const validationError = validateDesignFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      onChange(await readFileAsDataUrl(file));
    } catch {
      setError("Could not read image.");
    } finally {
      setLoading(false);
    }
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

      {value ? (
        <div className="relative mt-2 aspect-[3/4] overflow-hidden border border-brand/15 bg-brand/[0.03]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-white/95 text-brand shadow-sm"
            aria-label={`Remove ${label.toLowerCase()}`}
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={loading}
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
            if (file) void handleFile(file);
          }}
          className={cn(
            "mt-2 flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 border border-dashed px-4 text-center transition-colors",
            dragging
              ? "border-brand bg-brand/[0.04]"
              : "border-brand/25 hover:border-brand/45 hover:bg-brand/[0.02]",
            loading && "opacity-60",
          )}
        >
          <ImagePlus className="h-8 w-8 text-brand/45" strokeWidth={1.25} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand/55">
            {loading ? "Uploading…" : "Upload image"}
          </span>
          <span className="text-[10px] text-brand/40">PNG, JPG, WebP · 8MB max</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

type ProductImagesUploadProps = {
  front: string;
  back: string;
  onFrontChange: (value: string) => void;
  onBackChange: (value: string) => void;
};

export function ProductImagesUpload({
  front,
  back,
  onFrontChange,
  onBackChange,
}: ProductImagesUploadProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ProductImageSlot label="Front" value={front} onChange={onFrontChange} />
      <ProductImageSlot
        label="Back"
        value={back}
        onChange={onBackChange}
        optional
      />
    </div>
  );
}
