"use client";

import { useCart } from "@/context/cart-context";
import {
  calculateCustomTeePrice,
  customizerColors,
  defaultPlacement,
  printZones,
  type CustomTeeDesign,
  type CustomTeeSide,
  type DesignPlacement,
} from "@/data/customizer";
import { PRODUCT_SIZES, type ProductSize } from "@/data/products";
import { formatGhs } from "@/lib/format-ghs";
import {
  createCustomTeeThumbnail,
  readFileAsDataUrl,
  validateDesignFile,
} from "@/lib/image-utils";
import { cn } from "@/lib/cn";
import { useMemo, useRef, useState } from "react";
import { QuantitySelector } from "../shop/quantity-selector";
import { DesignControls, DesignUpload } from "./design-controls";
import { TeePreview } from "./tee-preview";

export function CustomizerStudio() {
  const { addCustomTeeToCart } = useCart();
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const [activeView, setActiveView] = useState<CustomTeeSide>("front");
  const [selectedColor, setSelectedColor] = useState(customizerColors[0]);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [frontPlacement, setFrontPlacement] =
    useState<DesignPlacement>(defaultPlacement);
  const [backPlacement, setBackPlacement] =
    useState<DesignPlacement>(defaultPlacement);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const price = useMemo(
    () => calculateCustomTeePrice(Boolean(frontImage), Boolean(backImage)),
    [frontImage, backImage],
  );

  const currentDesign = activeView === "front" ? frontImage : backImage;
  const currentPlacement =
    activeView === "front" ? frontPlacement : backPlacement;
  const setCurrentPlacement =
    activeView === "front" ? setFrontPlacement : setBackPlacement;

  async function handleUpload(file: File) {
    const validationError = validateDesignFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    try {
      setUploadError(null);
      const dataUrl = await readFileAsDataUrl(file);
      if (activeView === "front") {
        setFrontImage(dataUrl);
        setFrontPlacement(defaultPlacement);
      } else {
        setBackImage(dataUrl);
        setBackPlacement(defaultPlacement);
      }
    } catch {
      setUploadError("Could not read that file. Try another image.");
    }
  }

  function handleRemoveDesign() {
    if (activeView === "front") {
      setFrontImage(null);
      setFrontPlacement(defaultPlacement);
    } else {
      setBackImage(null);
      setBackPlacement(defaultPlacement);
    }
  }

  const canAdd =
    selectedSize !== null && (frontImage !== null || backImage !== null);

  const isWhite = selectedColor.hex.toLowerCase() === "#ffffff";

  async function handleAddToBag() {
    if (!canAdd || !selectedSize || adding) return;

    setAdding(true);
    try {
      const customTee: CustomTeeDesign = {
        colorId: selectedColor.id,
        colorName: selectedColor.name,
        colorHex: selectedColor.hex,
        frontImage,
        backImage,
        frontPlacement,
        backPlacement,
      };

      const thumbnail = await createCustomTeeThumbnail(
        selectedColor.hex,
        frontImage,
      );

      await addCustomTeeToCart(
        {
          name: `Custom Tee · ${selectedColor.name}`,
          image: thumbnail || "/shop/tees/Plain.jpg",
          priceGhs: price,
          size: selectedSize,
          quantity,
          customTee,
        },
        addButtonRef.current,
      );
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-4 sm:px-6 lg:pb-24 lg:pt-8">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16 xl:grid-cols-[minmax(0,420px)_1fr]">
        {/* Controls */}
        <div className="order-2 space-y-8 lg:order-1">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
              Studio
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-brand sm:text-4xl">
              Customize your tee
            </h1>
            <p className="mt-3 text-sm font-medium leading-relaxed text-brand/70">
              Upload your artwork for the front and back, drag to position, and
              preview before you order.
            </p>
          </div>

          <div className="flex gap-2">
            {(["front", "back"] as const).map((side) => {
              const hasDesign = side === "front" ? frontImage : backImage;
              return (
                <button
                  key={side}
                  type="button"
                  onClick={() => setActiveView(side)}
                  className={cn(
                    "flex-1 border py-3 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors",
                    activeView === side
                      ? "border-brand bg-brand text-white"
                      : "border-brand/20 text-brand/60 hover:border-brand/40 hover:text-brand",
                  )}
                >
                  {side}
                  {hasDesign ? " · ✓" : ""}
                </button>
              );
            })}
          </div>

          <DesignUpload
            side={activeView}
            designUrl={currentDesign}
            error={uploadError}
            onUpload={handleUpload}
          />

          <DesignControls
            side={activeView}
            placement={currentPlacement}
            hasDesign={Boolean(currentDesign)}
            onChange={setCurrentPlacement}
            onRemove={handleRemoveDesign}
          />

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
              Tee color
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {customizerColors.map((color) => {
                const isActive = selectedColor.id === color.id;
                const isLight = color.hex.toLowerCase() === "#ffffff";
                return (
                  <button
                    key={color.id}
                    type="button"
                    title={color.name}
                    aria-label={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "h-9 w-9 rounded-full border-2 transition-transform hover:scale-105",
                      isActive
                        ? "border-brand ring-2 ring-brand/25"
                        : "border-brand/20",
                      isLight &&
                        "shadow-[inset_0_0_0_1px_rgba(139,58,31,0.15)]",
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
            <p className="mt-2 text-xs font-medium text-brand/55">
              {selectedColor.name}
              {!isWhite ? " · preview on white mockup" : ""}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
              Size
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRODUCT_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "min-w-[3rem] border px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
                    selectedSize === size
                      ? "border-brand bg-brand text-white"
                      : "border-brand/25 text-brand hover:border-brand",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <QuantitySelector value={quantity} onChange={setQuantity} />

          <div className="border-t border-brand/10 pt-6">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                Total
              </span>
              <span className="text-xl font-semibold text-brand">
                {formatGhs(price * quantity)}
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-brand/50">
              {formatGhs(price)} each · base + print
              {frontImage && backImage
                ? " (front & back)"
                : frontImage
                  ? " (front)"
                  : " (back)"}
            </p>

            <button
              ref={addButtonRef}
              type="button"
              disabled={!canAdd || adding}
              onClick={handleAddToBag}
              className={cn(
                "mt-6 w-full border px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] transition-opacity",
                canAdd && !adding
                  ? "border-brand bg-brand text-white hover:opacity-90"
                  : "cursor-not-allowed border-brand/20 text-brand/35",
              )}
            >
              {adding ? "Adding…" : "Add custom tee to bag"}
            </button>
            {!frontImage && !backImage ? (
              <p className="mt-3 text-xs font-medium text-brand/50">
                Upload at least one design to continue.
              </p>
            ) : null}
          </div>
        </div>

        {/* Preview */}
        <div className="order-1 lg:order-2">
          <div className="sticky top-28 space-y-6">
            <div className="flex items-center justify-between border-b border-brand/10 pb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/50">
                Live preview
              </p>
              <div className="flex gap-2">
                {(["front", "back"] as const).map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => setActiveView(side)}
                    className={cn(
                      "px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors",
                      activeView === side
                        ? "bg-brand text-white"
                        : "text-brand/45 hover:text-brand",
                    )}
                  >
                    {side}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-sm bg-[#0b0b0b] px-2 py-6 sm:px-6">
              <TeePreview
                key={activeView}
                view={activeView}
                colorHex={selectedColor.hex}
                designUrl={currentDesign}
                placement={currentPlacement}
                printZone={printZones[activeView]}
                onPlacementChange={setCurrentPlacement}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setActiveView("front")}
                className={cn(
                  "overflow-hidden border p-3 text-left transition-colors",
                  activeView === "front"
                    ? "border-brand/40 bg-brand/[0.03]"
                    : "border-brand/10 bg-brand/[0.02] hover:border-brand/25",
                )}
              >
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-brand/45">
                  Front {frontImage ? "· ready" : ""}
                </p>
                <div className="pointer-events-none mx-auto mt-1 h-36 max-w-[9rem] overflow-hidden">
                  <TeePreview
                    view="front"
                    colorHex={selectedColor.hex}
                    designUrl={frontImage}
                    placement={frontPlacement}
                    printZone={printZones.front}
                    onPlacementChange={setFrontPlacement}
                    interactive={false}
                  />
                </div>
              </button>
              <button
                type="button"
                onClick={() => setActiveView("back")}
                className={cn(
                  "overflow-hidden border p-3 text-left transition-colors",
                  activeView === "back"
                    ? "border-brand/40 bg-brand/[0.03]"
                    : "border-brand/10 bg-brand/[0.02] hover:border-brand/25",
                )}
              >
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-brand/45">
                  Back {backImage ? "· ready" : ""}
                </p>
                <div className="pointer-events-none mx-auto mt-1 h-36 max-w-[9rem] overflow-hidden">
                  <TeePreview
                    view="back"
                    colorHex={selectedColor.hex}
                    designUrl={backImage}
                    placement={backPlacement}
                    printZone={printZones.back}
                    onPlacementChange={setBackPlacement}
                    interactive={false}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
