"use client";

import type { CustomTeeSide, DesignPlacement } from "@/data/customizer";
import { defaultPlacement } from "@/data/customizer";
import { cn } from "@/lib/cn";
import { Minus, Plus, RotateCcw, Trash2 } from "lucide-react";

type DesignControlsProps = {
  side: CustomTeeSide;
  placement: DesignPlacement;
  hasDesign: boolean;
  onChange: (placement: DesignPlacement) => void;
  onRemove: () => void;
};

export function DesignControls({
  side,
  placement,
  hasDesign,
  onChange,
  onRemove,
}: DesignControlsProps) {
  if (!hasDesign) return null;

  return (
    <div className="space-y-4 border border-brand/10 p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
          {side} design
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand/50 transition-opacity hover:text-brand"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.25} />
          Remove
        </button>
      </div>

      <div>
        <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/60">
          Size
        </label>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            aria-label="Decrease design size"
            onClick={() =>
              onChange({
                ...placement,
                scale: Math.max(0.4, Number((placement.scale - 0.05).toFixed(2))),
              })
            }
            className="flex h-9 w-9 items-center justify-center border border-brand/20 text-brand hover:border-brand"
          >
            <Minus className="h-4 w-4" strokeWidth={1.25} />
          </button>
          <input
            type="range"
            min={40}
            max={180}
            value={Math.round(placement.scale * 100)}
            onChange={(e) =>
              onChange({
                ...placement,
                scale: Number(e.target.value) / 100,
              })
            }
            className="h-1 flex-1 cursor-pointer appearance-none bg-brand/15 accent-brand"
          />
          <button
            type="button"
            aria-label="Increase design size"
            onClick={() =>
              onChange({
                ...placement,
                scale: Math.min(1.8, Number((placement.scale + 0.05).toFixed(2))),
              })
            }
            className="flex h-9 w-9 items-center justify-center border border-brand/20 text-brand hover:border-brand"
          >
            <Plus className="h-4 w-4" strokeWidth={1.25} />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() =>
            onChange({
              ...placement,
              rotation: placement.rotation - 15,
            })
          }
          className="flex-1 border border-brand/20 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand transition-opacity hover:opacity-70"
        >
          Rotate −
        </button>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...placement,
              rotation: placement.rotation + 15,
            })
          }
          className="flex-1 border border-brand/20 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand transition-opacity hover:opacity-70"
        >
          Rotate +
        </button>
        <button
          type="button"
          onClick={() => onChange(defaultPlacement)}
          className="flex items-center justify-center gap-1 border border-brand/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/60 transition-opacity hover:text-brand"
          aria-label="Reset placement"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.25} />
        </button>
      </div>

      <p className="text-xs font-medium text-brand/50">
        Drag the design on the preview to reposition it.
      </p>
    </div>
  );
}

type DesignUploadProps = {
  side: CustomTeeSide;
  designUrl: string | null;
  error: string | null;
  onUpload: (file: File) => void;
};

export function DesignUpload({
  side,
  designUrl,
  error,
  onUpload,
}: DesignUploadProps) {
  return (
    <div>
      <label
        htmlFor={`upload-${side}`}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center border border-dashed px-6 py-8 transition-colors",
          designUrl
            ? "border-brand/30 bg-brand/[0.02]"
            : "border-brand/20 hover:border-brand/40 hover:bg-brand/[0.02]",
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
          Upload {side} design
        </p>
        <p className="mt-2 text-xs font-medium text-brand/55">
          PNG, JPG, WebP or SVG · max 8MB
        </p>
        {designUrl ? (
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand/45">
            Tap to replace
          </p>
        ) : null}
        <input
          id={`upload-${side}`}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = "";
          }}
        />
      </label>
      {error ? (
        <p className="mt-2 text-xs font-medium text-brand">{error}</p>
      ) : null}
    </div>
  );
}
