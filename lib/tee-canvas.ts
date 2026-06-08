import type { CustomTeeSide, DesignPlacement, SideDesign } from "@/data/customizer";
import { teeMockupAssets } from "@/data/customizer-mockups";
import { normalizePlacement } from "@/lib/design-placement";
import { fontFamilyForId, normalizeTextDesign } from "@/lib/text-design";

const mockupCache = new Map<string, HTMLImageElement>();
const processedMockupCache = new Map<string, HTMLCanvasElement>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = mockupCache.get(src);
  if (cached?.complete) return Promise.resolve(cached);

  const isRemote = src.startsWith("http://") || src.startsWith("https://");

  return new Promise((resolve, reject) => {
    const img = new Image();
    if (isRemote) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => {
      mockupCache.set(src, img);
      resolve(img);
    };

    img.onerror = () => {
      if (isRemote) {
        // Fallback: fetch as a blob, convert to object URL, and load it.
        // This is extremely robust and avoids the CORS cache-poisoning issue in the browser.
        fetch(src, { cache: "no-cache" })
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return res.blob();
          })
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const retryImg = new Image();
            retryImg.onload = () => {
              mockupCache.set(src, retryImg);
              resolve(retryImg);
              // Clean up the object URL after image loads
              setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            };
            retryImg.onerror = () => {
              reject(new Error(`Failed to load blob image from ${blobUrl}`));
            };
            retryImg.src = blobUrl;
          })
          .catch((err: Error) => {
            reject(new Error(`Failed to load remote image: ${src}. ${err.message}`));
          });
      } else {
        reject(new Error(`Failed to load image: ${src}`));
      }
    };

    // If remote, let's append cache-bypass to avoid standard non-CORS cache entry.
    if (isRemote && !src.includes("cache-bypass")) {
      const delimiter = src.includes("?") ? "&" : "?";
      img.src = `${src}${delimiter}cache-bypass=${Date.now()}`;
    } else {
      img.src = src;
    }
  });
}

function mockupSrcForView(view: CustomTeeSide): string {
  return view === "front" ? teeMockupAssets.front : teeMockupAssets.back;
}

function processMockupImage(img: HTMLImageElement): HTMLCanvasElement {
  const cacheKey = img.src;
  const cached = processedMockupCache.get(cacheKey);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    if (r < 28 && g < 28 && b < 28) {
      data[i + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  processedMockupCache.set(cacheKey, canvas);
  return canvas;
}

function drawStudioBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.fillStyle = "#f7f4f2";
  ctx.fillRect(0, 0, width, height);

  const tile = 14;
  ctx.fillStyle = "rgba(139, 58, 31, 0.04)";
  for (let y = 0; y < height; y += tile) {
    for (let x = 0; x < width; x += tile) {
      if ((x / tile + y / tile) % 2 === 0) {
        ctx.fillRect(x, y, tile, tile);
      }
    }
  }
}

function applyShirtColor(
  ctx: CanvasRenderingContext2D,
  shirtCanvas: HTMLCanvasElement,
  x: number,
  y: number,
  w: number,
  h: number,
  colorHex: string,
) {
  if (colorHex.toLowerCase() === "#ffffff") {
    ctx.drawImage(shirtCanvas, x, y, w, h);
    return;
  }

  const tint = document.createElement("canvas");
  tint.width = shirtCanvas.width;
  tint.height = shirtCanvas.height;
  const tctx = tint.getContext("2d");
  if (!tctx) {
    ctx.drawImage(shirtCanvas, x, y, w, h);
    return;
  }

  tctx.drawImage(shirtCanvas, 0, 0);
  tctx.globalCompositeOperation = "source-in";
  tctx.fillStyle = colorHex;
  tctx.fillRect(0, 0, tint.width, tint.height);
  tctx.globalCompositeOperation = "multiply";
  tctx.drawImage(shirtCanvas, 0, 0);
  tctx.globalCompositeOperation = "destination-in";
  tctx.drawImage(shirtCanvas, 0, 0);

  ctx.drawImage(tint, x, y, w, h);
}

export type MockupBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function getMockupBounds(
  canvasW: number,
  canvasH: number,
  shirtW: number,
  shirtH: number,
): MockupBounds {
  const scale = Math.min(canvasW / shirtW, canvasH / shirtH);
  const width = shirtW * scale;
  const height = shirtH * scale;
  return {
    x: (canvasW - width) / 2,
    y: (canvasH - height) / 2,
    width,
    height,
  };
}

function drawImageLayer(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  placement: DesignPlacement,
  bounds: MockupBounds,
) {
  const p = normalizePlacement(placement);
  const designW = (p.width / 100) * bounds.width;
  const designH = designW / (image.naturalWidth / image.naturalHeight);
  const centerX = bounds.x + (p.x / 100) * bounds.width;
  const centerY = bounds.y + (p.y / 100) * bounds.height;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((p.rotation * Math.PI) / 180);
  ctx.drawImage(image, -designW / 2, -designH / 2, designW, designH);
  ctx.restore();
}

function drawTextLayer(
  ctx: CanvasRenderingContext2D,
  textDesign: ReturnType<typeof normalizeTextDesign>,
  bounds: MockupBounds,
) {
  const content = textDesign.content.trim();
  if (!content) return;

  const p = normalizePlacement(textDesign.placement);
  const fontSize = (p.width / 100) * bounds.width * 0.22;
  const centerX = bounds.x + (p.x / 100) * bounds.width;
  const centerY = bounds.y + (p.y / 100) * bounds.height;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((p.rotation * Math.PI) / 180);
  ctx.font = `600 ${fontSize}px ${fontFamilyForId(textDesign.fontId)}`;
  ctx.fillStyle = textDesign.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(content, 0, 0);
  ctx.restore();
}

export type RenderTeeCanvasOptions = {
  view: CustomTeeSide;
  colorHex: string;
  side: SideDesign;
};

export async function renderTeeCanvas(
  canvas: HTMLCanvasElement,
  options: RenderTeeCanvasOptions,
): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const displayW = canvas.clientWidth;
  const displayH = canvas.clientHeight;

  if (displayW === 0 || displayH === 0) return;

  canvas.width = Math.round(displayW * dpr);
  canvas.height = Math.round(displayH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  drawStudioBackground(ctx, displayW, displayH);

  const mockupImg = await loadImage(mockupSrcForView(options.view));
  const shirtCanvas = processMockupImage(mockupImg);

  const bounds = getMockupBounds(
    displayW,
    displayH,
    shirtCanvas.width,
    shirtCanvas.height,
  );

  applyShirtColor(
    ctx,
    shirtCanvas,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    options.colorHex,
  );

  if (options.side.image) {
    try {
      const image = await loadImage(options.side.image);
      drawImageLayer(ctx, image, options.side.imagePlacement, bounds);
    } catch (err) {
      console.error("Failed to load/draw side design image:", options.side.image, err);
    }
  }

  if (options.side.text?.content.trim()) {
    drawTextLayer(ctx, normalizeTextDesign(options.side.text), bounds);
  }
}
