import type { ProductColor } from "./products";

export const CUSTOM_TEE_BASE_PRICE = 95;
export const CUSTOM_PRINT_FEE = 35;

/** Position and size as percentages of the shirt mockup bounds. */
export type DesignPlacement = {
  x: number;
  y: number;
  /** Width as % of mockup bounds (images) or font scale (text). */
  width: number;
  rotation: number;
};

export const defaultPlacement: DesignPlacement = {
  x: 50,
  y: 48,
  width: 55,
  rotation: 0,
};

export const defaultTextPlacement: DesignPlacement = {
  x: 50,
  y: 42,
  width: 32,
  rotation: 0,
};

export type CustomizerFontId = "display" | "sans" | "bold" | "script";

export type CustomizerFont = {
  id: CustomizerFontId;
  name: string;
  cssFamily: string;
};

export const customizerFonts: CustomizerFont[] = [
  {
    id: "display",
    name: "Display",
    cssFamily: "var(--font-cormorant), Georgia, serif",
  },
  {
    id: "sans",
    name: "Modern",
    cssFamily: "var(--font-geist-sans), system-ui, sans-serif",
  },
  {
    id: "bold",
    name: "Bold",
    cssFamily: "Impact, Haettenschweiler, Arial Narrow, sans-serif",
  },
  {
    id: "script",
    name: "Script",
    cssFamily: "cursive",
  },
];

export function fontCssFamily(fontId: CustomizerFontId): string {
  return customizerFonts.find((f) => f.id === fontId)?.cssFamily ?? customizerFonts[0].cssFamily;
}

export const customizerColors: ProductColor[] = [
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "black", name: "Black", hex: "#1A1A1A" },
  { id: "grey", name: "Grey", hex: "#9CA3AF" },
  { id: "navy", name: "Navy", hex: "#1E3A5F" },
  { id: "sand", name: "Sand", hex: "#D4C4A8" },
  { id: "rust", name: "Rust", hex: "#8B3A1F" },
];

export type TextDesign = {
  content: string;
  fontId: CustomizerFontId;
  color: string;
  placement: DesignPlacement;
};

export const defaultTextDesign = (): TextDesign => ({
  content: "Your text",
  fontId: "display",
  color: "#8B3A1F",
  placement: { ...defaultTextPlacement },
});

export type SideDesign = {
  image: string | null;
  imagePlacement: DesignPlacement;
  text: TextDesign | null;
};

export function emptySideDesign(): SideDesign {
  return {
    image: null,
    imagePlacement: { ...defaultPlacement },
    text: null,
  };
}

export type CustomTeeSide = "front" | "back";

export type CustomTeeDesign = {
  colorId: string;
  colorName: string;
  colorHex: string;
  front: SideDesign;
  back: SideDesign;
};

export function createCustomTeeDesign(
  color: ProductColor,
  front: SideDesign = emptySideDesign(),
  back: SideDesign = emptySideDesign(),
): CustomTeeDesign {
  return {
    colorId: color.id,
    colorName: color.name,
    colorHex: color.hex,
    front,
    back,
  };
}

export function sideHasPrint(side: SideDesign): boolean {
  return Boolean(side.image || side.text?.content.trim());
}

export function designHasPrint(design: CustomTeeDesign): boolean {
  return sideHasPrint(design.front) || sideHasPrint(design.back);
}

export function calculateCustomTeePrice(design: CustomTeeDesign): number {
  let price = CUSTOM_TEE_BASE_PRICE;
  if (sideHasPrint(design.front)) price += CUSTOM_PRINT_FEE;
  if (sideHasPrint(design.back)) price += CUSTOM_PRINT_FEE;
  return price;
}

/** @deprecated Use mockup bounds — kept for thumbnail compat */
export type PrintZone = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export const mockupDesignBounds: PrintZone = {
  left: 0,
  top: 0,
  width: 100,
  height: 100,
};
