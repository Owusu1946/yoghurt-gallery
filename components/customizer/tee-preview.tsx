"use client";

import type {
  CustomTeeSide,
  DesignPlacement,
  SideDesign,
} from "@/data/customizer";
import { teeMockupAssets } from "@/data/customizer-mockups";
import {
  clampPlacement,
  normalizePlacement,
  placementFromPointer,
  widthFromResizePointer,
} from "@/lib/design-placement";
import { measureTextBox } from "@/lib/text-design";
import { getMockupBounds, loadImage, renderTeeCanvas } from "@/lib/tee-canvas";
import { cn } from "@/lib/cn";
import { RotateCw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type DesignLayerKind = "image" | "text";

type InteractionMode = "drag" | "resize" | "rotate";

type TeePreviewProps = {
  view: CustomTeeSide;
  colorHex: string;
  side: SideDesign;
  activeLayer: DesignLayerKind | null;
  onActiveLayerChange?: (layer: DesignLayerKind | null) => void;
  onImagePlacementChange: (placement: DesignPlacement) => void;
  onTextPlacementChange: (placement: DesignPlacement) => void;
  onRemoveImage?: () => void;
  onRemoveText?: () => void;
  interactive?: boolean;
  className?: string;
};

function LayerHandles({
  placement,
  aspectRatio,
  boundsAspect,
  canInteract,
  onPlacementChange,
  onRemove,
  layer,
  onPointerSession,
}: {
  placement: DesignPlacement;
  aspectRatio: number;
  boundsAspect: number;
  canInteract: boolean;
  onPlacementChange: (p: DesignPlacement) => void;
  onRemove?: () => void;
  layer: DesignLayerKind;
  onPointerSession: (
    event: React.PointerEvent<HTMLButtonElement>,
    mode: InteractionMode,
    layer: DesignLayerKind,
    placement: DesignPlacement,
    onPlacementChange: (p: DesignPlacement) => void,
  ) => void;
}) {
  const p = normalizePlacement(placement);

  if (!canInteract) return null;

  return (
    <div
      className="absolute"
      style={{
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: `${p.width}%`,
        transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
      }}
    >
      <div className="relative w-full" style={{ aspectRatio: String(aspectRatio) }}>
        <div
          className="pointer-events-none absolute inset-0 border-2 border-brand/70 shadow-[0_0_0_1px_rgba(255,255,255,0.8)]"
          aria-hidden
        />
        <button
          type="button"
          aria-label="Drag design"
          className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
          onPointerDown={(event) =>
            onPointerSession(event, "drag", layer, p, onPlacementChange)
          }
        />
        {onRemove ? (
          <button
            type="button"
            aria-label="Remove"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute -left-3 -top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow-md sm:h-7 sm:w-7"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        ) : null}
        <button
          type="button"
          aria-label="Rotate"
          onPointerDown={(event) =>
            onPointerSession(event, "rotate", layer, p, onPlacementChange)
          }
          className="absolute -right-3 -top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-brand/15 bg-white text-brand shadow-md sm:h-7 sm:w-7"
        >
          <RotateCw className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
        <button
          type="button"
          aria-label="Resize"
          onPointerDown={(event) =>
            onPointerSession(event, "resize", layer, p, onPlacementChange)
          }
          className="absolute -bottom-3 -right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-brand/15 bg-white text-brand shadow-md sm:h-7 sm:w-7"
        >
          <span
            className="block h-2.5 w-2.5 rotate-45 border-b-2 border-r-2 border-brand"
            aria-hidden
          />
        </button>
      </div>
    </div>
  );
}

export function TeePreview({
  view,
  colorHex,
  side,
  activeLayer,
  onActiveLayerChange,
  onImagePlacementChange,
  onTextPlacementChange,
  onRemoveImage,
  onRemoveText,
  interactive = true,
  className,
}: TeePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boundsRef = useRef<HTMLDivElement>(null);
  const [imageAspect, setImageAspect] = useState(1);
  const [textAspect, setTextAspect] = useState(3);
  const [mockupSize, setMockupSize] = useState({ width: 1, height: 1 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const interactionRef = useRef<{
    mode: InteractionMode;
    layer: DesignLayerKind;
    startPlacement: DesignPlacement;
    startAngle?: number;
    startPointerAngle?: number;
    onChange: (p: DesignPlacement) => void;
  } | null>(null);

  const boundsAspect =
    mockupSize.width / Math.max(mockupSize.height, 1);

  useEffect(() => {
    if (!side.image) {
      setImageAspect(1);
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      setImageAspect(Math.max(img.naturalWidth / img.naturalHeight, 0.01));
    };
    img.src = side.image;
  }, [side.image]);

  useEffect(() => {
    if (!side.text?.content.trim() || containerSize.width === 0) {
      setTextAspect(3);
      return;
    }
    const box = measureTextBox(side.text, containerSize.width * 0.94);
    setTextAspect(box.aspectRatio);
  }, [side.text, containerSize.width]);

  useEffect(() => {
    const src =
      view === "front" ? teeMockupAssets.front : teeMockupAssets.back;
    void loadImage(src).then((img) => {
      setMockupSize({ width: img.naturalWidth, height: img.naturalHeight });
    });
  }, [view]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateLayout = () => {
      const { width, height } = container.getBoundingClientRect();
      setContainerSize({ width, height });
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let frame = 0;

    const paint = async () => {
      await renderTeeCanvas(canvas, { view, colorHex, side });
    };

    const schedulePaint = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        void paint();
      });
    };

    schedulePaint();
    const observer = new ResizeObserver(schedulePaint);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [view, colorHex, side]);

  const commit = useCallback(
    (next: DesignPlacement, onChange: (p: DesignPlacement) => void) => {
      onChange(clampPlacement(next));
    },
    [],
  );

  const endInteraction = useCallback(() => {
    interactionRef.current = null;
  }, []);

  const handleBoundsPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const session = interactionRef.current;
      const bounds = boundsRef.current;
      if (!session || !bounds) return;

      const rect = bounds.getBoundingClientRect();
      const aspect =
        session.layer === "text" ? textAspect : imageAspect;

      if (session.mode === "drag") {
        commit(
          {
            ...session.startPlacement,
            ...placementFromPointer(event.clientX, event.clientY, rect),
          },
          session.onChange,
        );
        return;
      }

      if (session.mode === "resize") {
        commit(
          {
            ...session.startPlacement,
            width: widthFromResizePointer(
              event.clientX,
              event.clientY,
              rect,
              session.startPlacement.x,
              session.startPlacement.y,
              aspect,
              boundsAspect,
            ),
          },
          session.onChange,
        );
        return;
      }

      if (session.mode === "rotate") {
        const centerX =
          rect.left + (session.startPlacement.x / 100) * rect.width;
        const centerY =
          rect.top + (session.startPlacement.y / 100) * rect.height;
        const angle =
          (Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180) /
          Math.PI;
        commit(
          {
            ...session.startPlacement,
            rotation:
              session.startAngle! + (angle - (session.startPointerAngle ?? 0)),
          },
          session.onChange,
        );
      }
    },
    [boundsAspect, commit, imageAspect, textAspect],
  );

  const startInteraction = useCallback(
    (
      event: React.PointerEvent<HTMLButtonElement>,
      mode: InteractionMode,
      layer: DesignLayerKind,
      placement: DesignPlacement,
      onChange: (p: DesignPlacement) => void,
    ) => {
      if (!interactive || !boundsRef.current) return;
      event.stopPropagation();
      event.preventDefault();
      boundsRef.current.setPointerCapture(event.pointerId);

      const session: (typeof interactionRef)["current"] = {
        mode,
        layer,
        startPlacement: placement,
        onChange,
      };

      if (mode === "rotate") {
        const rect = boundsRef.current.getBoundingClientRect();
        const centerX = rect.left + (placement.x / 100) * rect.width;
        const centerY = rect.top + (placement.y / 100) * rect.height;
        session.startAngle = placement.rotation;
        session.startPointerAngle =
          (Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180) /
          Math.PI;
      }

      interactionRef.current = session;
    },
    [interactive],
  );

  const boundsStyle = (() => {
    if (containerSize.width === 0) {
      return { left: "0%", top: "0%", width: "100%", height: "100%" };
    }

    const bounds = getMockupBounds(
      containerSize.width,
      containerSize.height,
      mockupSize.width,
      mockupSize.height,
    );

    return {
      left: `${(bounds.x / containerSize.width) * 100}%`,
      top: `${(bounds.y / containerSize.height) * 100}%`,
      width: `${(bounds.width / containerSize.width) * 100}%`,
      height: `${(bounds.height / containerSize.height) * 100}%`,
    };
  })();

  const showImageHandles =
    interactive && side.image && activeLayer === "image";
  const showTextHandles =
    interactive && side.text?.content.trim() && activeLayer === "text";
  const hasEditableLayer = Boolean(
    side.image || side.text?.content.trim(),
  );

  const selectDefaultLayer = useCallback(() => {
    if (!onActiveLayerChange) return;
    if (side.image) onActiveLayerChange("image");
    else if (side.text?.content.trim()) onActiveLayerChange("text");
  }, [onActiveLayerChange, side.image, side.text]);

  useEffect(() => {
    if (!interactive || activeLayer === null || !onActiveLayerChange) return;

    const clearActiveLayer = onActiveLayerChange;

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        clearActiveLayer(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [activeLayer, interactive, onActiveLayerChange]);

  function handleBoundsPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.target !== boundsRef.current) return;
    if (activeLayer !== null) {
      onActiveLayerChange?.(null);
      return;
    }
    selectDefaultLayer();
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div
        ref={containerRef}
        className="relative aspect-[4/5] w-full max-h-[min(72svh,640px)] overflow-hidden rounded-sm border border-brand/10 sm:max-h-none"
        onPointerDown={(event) => {
          const target = event.target as HTMLElement;
          if (
            activeLayer !== null &&
            (target === containerRef.current || target === canvasRef.current)
          ) {
            onActiveLayerChange?.(null);
          }
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden
        />

        <div
          ref={boundsRef}
          className="absolute touch-none"
          style={boundsStyle}
          onPointerDown={handleBoundsPointerDown}
          onPointerMove={handleBoundsPointerMove}
          onPointerUp={endInteraction}
          onPointerCancel={endInteraction}
        >
          {showImageHandles ? (
            <LayerHandles
              layer="image"
              placement={side.imagePlacement}
              aspectRatio={imageAspect}
              boundsAspect={boundsAspect}
              canInteract
              onPlacementChange={onImagePlacementChange}
              onRemove={onRemoveImage}
              onPointerSession={startInteraction}
            />
          ) : null}

          {showTextHandles ? (
            <LayerHandles
              layer="text"
              placement={side.text!.placement}
              aspectRatio={textAspect}
              boundsAspect={boundsAspect}
              canInteract
              onPlacementChange={onTextPlacementChange}
              onRemove={onRemoveText}
              onPointerSession={startInteraction}
            />
          ) : null}
        </div>

        {interactive && onActiveLayerChange && hasEditableLayer ? (
          <div className="absolute bottom-3 left-1/2 z-20 flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 gap-1 rounded-full border border-brand/15 bg-white/95 p-1 shadow-sm backdrop-blur-sm">
            {side.image ? (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => onActiveLayerChange("image")}
                className={cn(
                  "min-h-9 flex-1 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors sm:min-h-0 sm:flex-none sm:py-1",
                  activeLayer === "image"
                    ? "bg-brand text-white"
                    : "text-brand/55 hover:text-brand",
                )}
              >
                Image
              </button>
            ) : null}
            {side.text?.content.trim() ? (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => onActiveLayerChange("text")}
                className={cn(
                  "min-h-9 flex-1 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors sm:min-h-0 sm:flex-none sm:py-1",
                  activeLayer === "text"
                    ? "bg-brand text-white"
                    : "text-brand/55 hover:text-brand",
                )}
              >
                Text
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {interactive && hasEditableLayer ? (
        <p className="mt-3 text-center text-[9px] font-medium uppercase tracking-[0.22em] text-brand/45">
          {activeLayer
            ? "Tap outside to finish · drag to move"
            : "Tap the shirt to edit your design"}
        </p>
      ) : null}
    </div>
  );
}
