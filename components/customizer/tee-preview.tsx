"use client";

import type { CustomTeeSide, DesignPlacement, PrintZone } from "@/data/customizer";
import { cn } from "@/lib/cn";
import { useCallback, useRef } from "react";
import { TeeMockupImage } from "./tee-mockup-image";

type TeePreviewProps = {
  view: CustomTeeSide;
  colorHex: string;
  designUrl: string | null;
  placement: DesignPlacement;
  printZone: PrintZone;
  onPlacementChange: (placement: DesignPlacement) => void;
  interactive?: boolean;
};

export function TeePreview({
  view,
  colorHex,
  designUrl,
  placement,
  printZone,
  onPlacementChange,
  interactive = true,
}: TeePreviewProps) {
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const isWhite = colorHex.toLowerCase() === "#ffffff";

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!interactive || !designUrl) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        originX: placement.x,
        originY: placement.y,
      };
    },
    [designUrl, interactive, placement.x, placement.y],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      const dx = event.clientX - dragRef.current.startX;
      const dy = event.clientY - dragRef.current.startY;
      onPlacementChange({
        ...placement,
        x: dragRef.current.originX + dx,
        y: dragRef.current.originY + dy,
      });
    },
    [onPlacementChange, placement],
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#0b0b0b]">
        <TeeMockupImage view={view} className="absolute inset-0" />

        {!isWhite ? (
          <div
            className="pointer-events-none absolute inset-0 mix-blend-color opacity-[0.35]"
            style={{ backgroundColor: colorHex }}
            aria-hidden
          />
        ) : null}

        <div
          className="absolute"
          style={{
            left: `${printZone.left}%`,
            top: `${printZone.top}%`,
            width: `${printZone.width}%`,
            height: `${printZone.height}%`,
          }}
        >
          <div
            className={cn(
              "absolute inset-0 border border-dashed border-white/20",
              designUrl && interactive && "border-white/35",
            )}
            aria-hidden
          />

          {designUrl ? (
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center overflow-hidden",
                interactive && "cursor-grab active:cursor-grabbing",
              )}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={designUrl}
                alt=""
                draggable={false}
                className="max-h-full max-w-full select-none object-contain drop-shadow-sm"
                style={{
                  transform: `translate(${placement.x}px, ${placement.y}px) scale(${placement.scale}) rotate(${placement.rotation}deg)`,
                }}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                {view} print area
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 text-center text-[9px] font-semibold uppercase tracking-[0.28em] text-brand/40">
        {view} preview
      </p>
    </div>
  );
}
