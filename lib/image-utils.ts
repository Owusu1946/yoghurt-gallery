import type { CustomTeeDesign } from "@/data/customizer";
import { normalizeCustomTeeDesign } from "@/lib/customizer-migrate";

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
] as const;

export function validateDesignFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    return "Use PNG, JPG, WebP, or SVG.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return "File must be under 50MB";
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

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.88;

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
  const { renderCustomTeePreview } = await import("@/lib/custom-tee-assets");
  return renderCustomTeePreview(design, "front");
}
