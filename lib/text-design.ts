import {
  fontCssFamily,
  type CustomizerFontId,
  type TextDesign,
} from "@/data/customizer";

const MAX_TEXT_LENGTH = 120;
const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function sanitizeDesignText(input: string): string {
  return input
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .slice(0, MAX_TEXT_LENGTH);
}

export function sanitizeTextColor(input: string): string {
  const trimmed = input.trim();
  if (HEX_COLOR.test(trimmed)) return trimmed;
  return "#8B3A1F";
}

export function normalizeTextDesign(text: TextDesign): TextDesign {
  return {
    content: sanitizeDesignText(text.content),
    fontId: text.fontId,
    color: sanitizeTextColor(text.color),
    placement: text.placement,
  };
}

export function measureTextBox(
  text: TextDesign,
  mockupWidth: number,
): { width: number; height: number; aspectRatio: number } {
  if (typeof document === "undefined" || !text.content.trim()) {
    return { width: 1, height: 1, aspectRatio: 3 };
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return { width: 1, height: 1, aspectRatio: 3 };

  const fontSize = (text.placement.width / 100) * mockupWidth * 0.22;
  ctx.font = `600 ${fontSize}px ${fontCssFamily(text.fontId)}`;
  const metrics = ctx.measureText(text.content);
  const width = Math.max(metrics.width, fontSize * 0.5);
  const height = fontSize * 1.2;

  return {
    width,
    height,
    aspectRatio: width / Math.max(height, 1),
  };
}

export function textFontSizePx(
  placementWidth: number,
  mockupWidth: number,
): number {
  return (placementWidth / 100) * mockupWidth * 0.22;
}

export function fontFamilyForId(fontId: CustomizerFontId): string {
  return fontCssFamily(fontId);
}
