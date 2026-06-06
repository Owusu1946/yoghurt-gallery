"use client";

import type { DesignPlacement } from "@/data/customizer";
import { defaultPlacement } from "@/data/customizer";
import { normalizePlacement } from "@/lib/design-placement";
import { AlignCenter, Minus, Plus, RotateCcw, Trash2 } from "lucide-react";

type PlacementControlsProps = {
  label: string;
  placement: DesignPlacement;
  resetPlacement?: DesignPlacement;
  onChange: (placement: DesignPlacement) => void;
  onRemove: () => void;
};

export function PlacementControls({
  label,
  placement: rawPlacement,
  resetPlacement = defaultPlacement,
  onChange,
  onRemove,
}: PlacementControlsProps) {
  const placement = normalizePlacement(rawPlacement);

  return (
    <div className="space-y-4 border border-brand/10 p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
          {label}
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
            aria-label="Decrease size"
            onClick={() =>
              onChange({ ...placement, width: Math.max(6, placement.width - 4) })
            }
            className="flex h-9 w-9 items-center justify-center border border-brand/20 text-brand hover:border-brand"
          >
            <Minus className="h-4 w-4" strokeWidth={1.25} />
          </button>
          <input
            type="range"
            min={6}
            max={180}
            value={Math.round(placement.width)}
            onChange={(e) =>
              onChange({ ...placement, width: Number(e.target.value) })
            }
            className="h-1 flex-1 cursor-pointer appearance-none bg-brand/15 accent-brand"
          />
          <button
            type="button"
            aria-label="Increase size"
            onClick={() =>
              onChange({ ...placement, width: Math.min(180, placement.width + 4) })
            }
            className="flex h-9 w-9 items-center justify-center border border-brand/20 text-brand hover:border-brand"
          >
            <Plus className="h-4 w-4" strokeWidth={1.25} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange({ ...placement, x: 50 })}
          className="flex min-h-11 items-center justify-center gap-1.5 border border-brand/20 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand transition-opacity hover:opacity-70 sm:min-h-0"
        >
          <AlignCenter className="h-3.5 w-3.5" strokeWidth={1.25} />
          Center H
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...placement, y: 50 })}
          className="flex min-h-11 items-center justify-center gap-1.5 border border-brand/20 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand transition-opacity hover:opacity-70 sm:min-h-0"
        >
          <AlignCenter className="h-3.5 w-3.5 rotate-90" strokeWidth={1.25} />
          Center V
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() =>
            onChange({ ...placement, rotation: placement.rotation - 15 })
          }
          className="min-h-11 flex-1 border border-brand/20 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand transition-opacity hover:opacity-70 sm:min-h-0"
        >
          Rotate −
        </button>
        <button
          type="button"
          onClick={() =>
            onChange({ ...placement, rotation: placement.rotation + 15 })
          }
          className="min-h-11 flex-1 border border-brand/20 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand transition-opacity hover:opacity-70 sm:min-h-0"
        >
          Rotate +
        </button>
        <button
          type="button"
          onClick={() => onChange(resetPlacement)}
          className="flex min-h-11 items-center justify-center gap-1 border border-brand/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/60 transition-opacity hover:text-brand sm:min-h-0"
          aria-label="Reset placement"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.25} />
        </button>
      </div>
    </div>
  );
}
