import type { CustomTeeDesign } from "@/data/customizer";
import { normalizeCustomTeeDesign } from "@/lib/customizer-migrate";

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.88;

export function validateDesignFile(file: File): string | null {
  const allowed = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
  if (!allowed.includes(file.type)) {
    return "Use PNG, JPG, WebP, or SVG.";
  }
  if (file.size > 8 * 1024 * 1024) {
    return "File must be under 8MB";
  }
  return null;
}

export async function readFileAsDataUrl(file: File): Promise<string> {
  if (file.type === "image/svg+xml") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  if (file.type === "image/jpeg") {
    return compressImageFile(file, "image/jpeg");
  }

  return compressImageFile(file, "image/png");
}

async function compressImageFile(
  file: File,
  mime: "image/jpeg" | "image/png",
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
  );
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not process image.");
  }

  if (mime === "image/png") {
    ctx.clearRect(0, 0, width, height);
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return mime === "image/png"
    ? canvas.toDataURL("image/png")
    : canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export async function createCustomTeeThumbnail(
  design: CustomTeeDesign,
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.style.width = "400px";
  canvas.style.height = "480px";

  const normalized = normalizeCustomTeeDesign(design);
  const { renderTeeCanvas } = await import("@/lib/tee-canvas");

  await renderTeeCanvas(canvas, {
    view: "front",
    colorHex: normalized.colorHex,
    side: normalized.front,
  });

  return canvas.toDataURL("image/png", 0.92);
}
