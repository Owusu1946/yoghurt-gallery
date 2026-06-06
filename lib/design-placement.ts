import type { DesignPlacement } from "@/data/customizer";
import { defaultPlacement } from "@/data/customizer";

type LegacyPlacement = {
  x?: number;
  y?: number;
  scale?: number;
  width?: number;
  rotation?: number;
};

const MIN_WIDTH = 6;
const MAX_WIDTH = 180;
const MIN_AXIS = -40;
const MAX_AXIS = 140;

export function normalizePlacement(
  placement: LegacyPlacement | DesignPlacement,
): DesignPlacement {
  if ("width" in placement && typeof placement.width === "number") {
    return clampPlacement({
      x: placement.x ?? defaultPlacement.x,
      y: placement.y ?? defaultPlacement.y,
      width: placement.width,
      rotation: placement.rotation ?? 0,
    });
  }

  const legacy = placement as LegacyPlacement;
  const scale = legacy.scale ?? 1;
  return clampPlacement({
    x: defaultPlacement.x,
    y: defaultPlacement.y,
    width: Math.min(MAX_WIDTH, defaultPlacement.width * scale),
    rotation: placement.rotation ?? 0,
  });
}

/** Loose bounds — full mockup movement, no print-zone cage. */
export function clampPlacement(placement: DesignPlacement): DesignPlacement {
  return {
    x: clamp(placement.x, MIN_AXIS, MAX_AXIS),
    y: clamp(placement.y, MIN_AXIS, MAX_AXIS),
    width: clamp(placement.width, MIN_WIDTH, MAX_WIDTH),
    rotation: placement.rotation,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function placementFromPointer(
  clientX: number,
  clientY: number,
  boundsRect: DOMRect,
): Pick<DesignPlacement, "x" | "y"> {
  return {
    x: ((clientX - boundsRect.left) / boundsRect.width) * 100,
    y: ((clientY - boundsRect.top) / boundsRect.height) * 100,
  };
}

export function widthFromResizePointer(
  clientX: number,
  clientY: number,
  boundsRect: DOMRect,
  centerX: number,
  centerY: number,
  aspectRatio: number,
  boundsAspect: number,
): number {
  const pointerX = ((clientX - boundsRect.left) / boundsRect.width) * 100;
  const pointerY = ((clientY - boundsRect.top) / boundsRect.height) * 100;
  const halfW = Math.max(
    Math.abs(pointerX - centerX),
    Math.abs(pointerY - centerY) * aspectRatio * boundsAspect,
  );
  return clamp(halfW * 2, MIN_WIDTH, MAX_WIDTH);
}
