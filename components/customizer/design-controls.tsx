"use client";

import type { CustomTeeSide } from "@/data/customizer";
import { cn } from "@/lib/cn";
import { PlacementControls } from "./placement-controls";

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
          Upload {side} image
        </p>
        <p className="mt-2 text-xs font-medium text-brand/55">
          PNG with transparent background recommended · max 8MB
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

export { PlacementControls };
