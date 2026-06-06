"use client";

import {
  customizerFonts,
  defaultTextDesign,
  defaultTextPlacement,
  type CustomizerFontId,
  type TextDesign,
} from "@/data/customizer";
import { cn } from "@/lib/cn";
import {
  normalizeTextDesign,
  sanitizeDesignText,
  sanitizeTextColor,
} from "@/lib/text-design";
import { PlacementControls } from "./placement-controls";

const presetColors = [
  "#8B3A1F",
  "#1A1A1A",
  "#FFFFFF",
  "#1E3A5F",
  "#E53935",
  "#1E88E5",
];

type TextDesignControlsProps = {
  text: TextDesign | null;
  onChange: (text: TextDesign) => void;
  onAdd: () => void;
  onRemove: () => void;
};

export function TextDesignControls({
  text,
  onChange,
  onAdd,
  onRemove,
}: TextDesignControlsProps) {
  if (!text) {
    return (
      <button
        type="button"
        onClick={onAdd}
        className="w-full border border-dashed border-brand/25 px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand transition-colors hover:border-brand/45 hover:bg-brand/[0.02]"
      >
        + Add text design
      </button>
    );
  }

  const normalized = normalizeTextDesign(text);

  function update(patch: Partial<TextDesign>) {
    onChange(normalizeTextDesign({ ...normalized, ...patch }));
  }

  return (
    <div className="space-y-4">
      <div className="border border-brand/10 p-4">
        <label
          htmlFor="custom-text"
          className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand"
        >
          Text
        </label>
        <textarea
          id="custom-text"
          rows={2}
          value={normalized.content}
          onChange={(e) =>
            update({ content: sanitizeDesignText(e.target.value) })
          }
          className="mt-2 w-full resize-y border border-brand/20 bg-white px-3 py-2.5 text-sm text-brand outline-none focus:border-brand"
          placeholder="Type your message"
          maxLength={120}
        />

        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/60">
          Font
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {customizerFonts.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => update({ fontId: font.id as CustomizerFontId })}
              className={cn(
                "border px-3 py-2.5 text-left text-sm transition-colors",
                normalized.fontId === font.id
                  ? "border-brand bg-brand/[0.04] text-brand"
                  : "border-brand/20 text-brand/70 hover:border-brand/40",
              )}
              style={{ fontFamily: font.cssFamily }}
            >
              {font.name}
            </button>
          ))}
        </div>

        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/60">
          Color
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Color ${color}`}
              onClick={() => update({ color })}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-transform hover:scale-105",
                normalized.color.toLowerCase() === color.toLowerCase()
                  ? "border-brand ring-2 ring-brand/25"
                  : "border-brand/20",
                color.toLowerCase() === "#ffffff" &&
                  "shadow-[inset_0_0_0_1px_rgba(139,58,31,0.15)]",
              )}
              style={{ backgroundColor: color }}
            />
          ))}
          <input
            type="color"
            value={normalized.color}
            onChange={(e) => update({ color: sanitizeTextColor(e.target.value) })}
            className="h-8 w-10 cursor-pointer border-0 bg-transparent p-0"
            aria-label="Custom color"
          />
        </div>
      </div>

      <PlacementControls
        label="Text placement"
        placement={normalized.placement}
        resetPlacement={defaultTextPlacement}
        onChange={(placement) => update({ placement })}
        onRemove={onRemove}
      />
    </div>
  );
}

export { defaultTextDesign, defaultTextPlacement };
