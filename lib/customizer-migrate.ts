import {
  createCustomTeeDesign,
  defaultPlacement,
  emptySideDesign,
  type CustomTeeDesign,
  type SideDesign,
} from "@/data/customizer";
import { normalizePlacement } from "@/lib/design-placement";

/** Legacy cart shape before SideDesign refactor */
type LegacyCustomTee = {
  colorId: string;
  colorName: string;
  colorHex: string;
  frontImage?: string | null;
  backImage?: string | null;
  frontPlacement?: unknown;
  backPlacement?: unknown;
  frontText?: SideDesign["text"];
  backText?: SideDesign["text"];
  front?: SideDesign;
  back?: SideDesign;
};

export function normalizeCustomTeeDesign(raw: LegacyCustomTee): CustomTeeDesign {
  if (raw.front && raw.back) {
    return {
      colorId: raw.colorId,
      colorName: raw.colorName,
      colorHex: raw.colorHex,
      front: raw.front,
      back: raw.back,
    };
  }

  const base = createCustomTeeDesign({
    id: raw.colorId,
    name: raw.colorName,
    hex: raw.colorHex,
  });

  return {
    ...base,
    front: {
      image: raw.frontImage ?? null,
      imagePlacement: raw.frontPlacement
        ? normalizePlacement(raw.frontPlacement as Parameters<typeof normalizePlacement>[0])
        : { ...defaultPlacement },
      text: raw.frontText ?? null,
    },
    back: {
      image: raw.backImage ?? null,
      imagePlacement: raw.backPlacement
        ? normalizePlacement(raw.backPlacement as Parameters<typeof normalizePlacement>[0])
        : { ...defaultPlacement },
      text: raw.backText ?? null,
    },
  };
}

export function getSide(design: CustomTeeDesign, side: "front" | "back"): SideDesign {
  return design[side] ?? emptySideDesign();
}
