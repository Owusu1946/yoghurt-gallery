import type { ProductColor } from "./products";

export const CUSTOM_TEE_BASE_PRICE = 95;
export const CUSTOM_PRINT_FEE = 35;

export type DesignPlacement = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

export const defaultPlacement: DesignPlacement = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
};

export const customizerColors: ProductColor[] = [
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "black", name: "Black", hex: "#1A1A1A" },
  { id: "grey", name: "Grey", hex: "#9CA3AF" },
  { id: "navy", name: "Navy", hex: "#1E3A5F" },
  { id: "sand", name: "Sand", hex: "#D4C4A8" },
  { id: "rust", name: "Rust", hex: "#8B3A1F" },
];

export type PrintZone = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export const printZones = {
  front: { left: 31, top: 27, width: 38, height: 34 } satisfies PrintZone,
  back: { left: 31, top: 24, width: 38, height: 36 } satisfies PrintZone,
} as const;

export type CustomTeeSide = "front" | "back";

export type CustomTeeDesign = {
  colorId: string;
  colorName: string;
  colorHex: string;
  frontImage: string | null;
  backImage: string | null;
  frontPlacement: DesignPlacement;
  backPlacement: DesignPlacement;
};

export function calculateCustomTeePrice(hasFront: boolean, hasBack: boolean): number {
  let price = CUSTOM_TEE_BASE_PRICE;
  if (hasFront) price += CUSTOM_PRINT_FEE;
  if (hasBack) price += CUSTOM_PRINT_FEE;
  return price;
}
