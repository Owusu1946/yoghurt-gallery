import {
  customizerFonts,
  sideHasPrint,
  type CustomTeeDesign,
  type CustomTeeSide,
} from "@/data/customizer";
import { normalizeCustomTeeDesign } from "@/lib/customizer-migrate";
import { normalizePlacement } from "@/lib/design-placement";
import { normalizeTextDesign } from "@/lib/text-design";
import { renderTeeCanvas } from "@/lib/tee-canvas";

export type CustomTeeAsset = {
  id: string;
  label: string;
  kind: "image" | "text" | "preview";
  side: CustomTeeSide;
  href: string;
  meta?: string;
};

export function listCustomTeeAssets(design: CustomTeeDesign): CustomTeeAsset[] {
  const normalized = normalizeCustomTeeDesign(design);
  const assets: CustomTeeAsset[] = [];

  for (const side of ["front", "back"] as const) {
    const data = normalized[side];
    if (data.image) {
      assets.push({
        id: `${side}-image`,
        label: `${side} artwork`,
        kind: "image",
        side,
        href: data.image,
        meta: "Customer upload",
      });
    }
    if (data.text?.content.trim()) {
      const text = normalizeTextDesign(data.text);
      const font =
        customizerFonts.find((f) => f.id === text.fontId)?.name ?? text.fontId;
      const placement = normalizePlacement(text.placement);
      assets.push({
        id: `${side}-text`,
        label: `${side} text`,
        kind: "text",
        side,
        href: "#",
        meta: `"${text.content}" · ${font} · ${text.color} · ${Math.round(placement.width)}% · ${Math.round(placement.rotation)}°`,
      });
    }
  }

  return assets;
}

export function customTeeHasPrint(design: CustomTeeDesign): boolean {
  const normalized = normalizeCustomTeeDesign(design);
  return sideHasPrint(normalized.front) || sideHasPrint(normalized.back);
}

export async function renderCustomTeePreview(
  design: CustomTeeDesign,
  side: CustomTeeSide,
  width = 400,
  height = 480,
): Promise<string> {
  const normalized = normalizeCustomTeeDesign(design);
  const canvas = document.createElement("canvas");
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.style.position = "fixed";
  canvas.style.left = "-9999px";
  canvas.style.pointerEvents = "none";
  document.body.appendChild(canvas);

  try {
    await renderTeeCanvas(canvas, {
      view: side,
      colorHex: normalized.colorHex,
      side: normalized[side],
    });
    return canvas.toDataURL("image/png", 0.92);
  } finally {
    canvas.remove();
  }
}
