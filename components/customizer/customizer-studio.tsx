"use client";

import { useCart } from "@/context/cart-context";
import {
  createCustomTeeDesign,
  customizerColors,
  defaultPlacement,
  designHasPrint,
  emptySideDesign,
  sideHasPrint,
  type CustomTeeDesign,
  type CustomTeeSide,
  type SideDesign,
} from "@/data/customizer";
import { PRODUCT_SIZES, type ProductSize } from "@/data/products";
import { calculateCustomizerPrice } from "@/lib/customizer-pricing";
import { subscribeAdminSettings } from "@/lib/admin-settings";
import { formatGhs } from "@/lib/format-ghs";
import {
  createCustomTeeThumbnail,
  readFileAsDataUrl,
  validateDesignFile,
} from "@/lib/image-utils";
import { cn } from "@/lib/cn";
import { toast } from "@/lib/toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { QuantitySelector } from "../shop/quantity-selector";
import { DesignUpload, PlacementControls } from "./design-controls";
import {
  defaultTextDesign,
  TextDesignControls,
} from "./text-design-controls";
import { TeePreview, type DesignLayerKind } from "./tee-preview";

type DesignTab = "image" | "text";

export function CustomizerStudio() {
  const { addCustomTeeToCart } = useCart();
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const [activeView, setActiveView] = useState<CustomTeeSide>("front");
  const [designTab, setDesignTab] = useState<DesignTab>("image");
  const [activeLayer, setActiveLayer] = useState<DesignLayerKind | null>(null);
  const [selectedColor, setSelectedColor] = useState(customizerColors[0]);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pricingVersion, setPricingVersion] = useState(0);

  useEffect(
    () => subscribeAdminSettings(() => setPricingVersion((v) => v + 1)),
    [],
  );

  const [front, setFront] = useState<SideDesign>(emptySideDesign);
  const [back, setBack] = useState<SideDesign>(emptySideDesign);

  const currentSide = activeView === "front" ? front : back;
  const setCurrentSide = activeView === "front" ? setFront : setBack;

  const customTeeDesign = useMemo<CustomTeeDesign>(
    () => createCustomTeeDesign(selectedColor, front, back),
    [selectedColor, front, back],
  );

  const price = useMemo(() => {
    void pricingVersion;
    return calculateCustomizerPrice(customTeeDesign);
  }, [customTeeDesign, pricingVersion]);

  function switchView(side: CustomTeeSide) {
    setActiveView(side);
    setActiveLayer(null);
  }

  async function handleUpload(file: File) {
    const validationError = validateDesignFile(file);
    if (validationError) {
      setUploadError(validationError);
      toast.error("Upload failed", { description: validationError });
      return;
    }

    try {
      setUploadError(null);
      const dataUrl = await readFileAsDataUrl(file);
      setCurrentSide((current) => ({
        ...current,
        image: dataUrl,
        imagePlacement: { ...defaultPlacement },
      }));
      setDesignTab("image");
      setActiveLayer("image");
    } catch {
      const message = "Could not read that file. Try another image.";
      setUploadError(message);
      toast.error("Upload failed", { description: message });
    }
  }

  function handleRemoveImage() {
    setCurrentSide((current) => ({
      ...current,
      image: null,
      imagePlacement: { ...defaultPlacement },
    }));
    if (currentSide.text?.content.trim()) {
      setDesignTab("text");
      setActiveLayer("text");
    } else {
      setActiveLayer(null);
    }
  }

  function handleAddText() {
    setCurrentSide((current) => ({
      ...current,
      text: defaultTextDesign(),
    }));
    setDesignTab("text");
    setActiveLayer("text");
  }

  function handleRemoveText() {
    setCurrentSide((current) => ({
      ...current,
      text: null,
    }));
    if (currentSide.image) {
      setDesignTab("image");
      setActiveLayer("image");
    } else {
      setActiveLayer(null);
    }
  }

  const canAdd = selectedSize !== null && designHasPrint(customTeeDesign);
  const isWhite = selectedColor.hex.toLowerCase() === "#ffffff";

  async function handleAddToBag(sourceEl?: HTMLElement | null) {
    if (adding) return;

    if (!selectedSize) {
      toast.warning("Select a size", {
        description: "Choose your tee size before adding to bag.",
      });
      return;
    }

    if (!designHasPrint(customTeeDesign)) {
      toast.warning("Add a design", {
        description: "Upload an image or add text on the front or back.",
      });
      return;
    }

    setAdding(true);
    try {
      const thumbnail = await createCustomTeeThumbnail(customTeeDesign);

      await addCustomTeeToCart(
        {
          name: `Custom Tee · ${selectedColor.name}`,
          image: thumbnail || "/shop/tees/Plain.jpg",
          priceGhs: price,
          size: selectedSize,
          quantity,
          customTee: customTeeDesign,
        },
        addButtonRef.current ?? sourceEl ?? null,
      );
      toast.success("Custom tee added", {
        description: `${selectedColor.name} · Size ${selectedSize}${quantity > 1 ? ` · ×${quantity}` : ""}`,
      });
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-3 sm:px-6 sm:pb-24 sm:pt-4 lg:pb-24 lg:pt-8">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-14">
        <div className="order-2 space-y-6 lg:order-1 lg:space-y-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
              Studio
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-brand sm:text-3xl lg:text-4xl">
              Customize your tee
            </h1>
            <p className="mt-2 text-sm font-medium leading-relaxed text-brand/70 sm:mt-3">
              Upload artwork or add text. Tap the shirt to edit, tap outside when
              done.
            </p>
          </div>

          <div className="flex gap-2">
            {(["front", "back"] as const).map((side) => {
              const sideData = side === "front" ? front : back;
              const ready = sideHasPrint(sideData);
              return (
                <button
                  key={side}
                  type="button"
                  onClick={() => switchView(side)}
                  className={cn(
                    "flex-1 border py-3 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors",
                    activeView === side
                      ? "border-brand bg-brand text-white"
                      : "border-brand/20 text-brand/60 hover:border-brand/40 hover:text-brand",
                  )}
                >
                  {side}
                  {ready ? " · ✓" : ""}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            {(["image", "text"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setDesignTab(tab);
                  setActiveLayer(tab);
                }}
                className={cn(
                  "flex-1 border py-3 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors sm:py-2.5",
                  designTab === tab
                    ? "border-brand/40 bg-brand/[0.04] text-brand"
                    : "border-brand/15 text-brand/50 hover:border-brand/30 hover:text-brand",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {designTab === "image" ? (
            <>
              <DesignUpload
                side={activeView}
                designUrl={currentSide.image}
                error={uploadError}
                onUpload={handleUpload}
              />
              {currentSide.image ? (
                <PlacementControls
                  label={`${activeView} image`}
                  placement={currentSide.imagePlacement}
                  onChange={(imagePlacement) =>
                    setCurrentSide((current) => ({ ...current, imagePlacement }))
                  }
                  onRemove={handleRemoveImage}
                />
              ) : null}
            </>
          ) : (
            <TextDesignControls
              text={currentSide.text}
              onAdd={handleAddText}
              onRemove={handleRemoveText}
              onChange={(text) =>
                setCurrentSide((current) => ({ ...current, text }))
              }
            />
          )}

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
              {sideHasPrint(front) && sideHasPrint(back)
                ? " (front & back)"
                : sideHasPrint(front)
                  ? " (front)"
                  : sideHasPrint(back)
                    ? " (back)"
                    : ""}
            </p>

            <button
              ref={addButtonRef}
              type="button"
              disabled={!canAdd || adding}
              onClick={() => handleAddToBag()}
              className={cn(
                "mt-6 hidden w-full border px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] transition-opacity lg:inline-block",
                canAdd && !adding
                  ? "border-brand bg-brand text-white hover:opacity-90"
                  : "cursor-not-allowed border-brand/20 text-brand/35",
              )}
            >
              {adding ? "Adding…" : "Add custom tee to bag"}
            </button>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-28 lg:space-y-6">
            <div className="flex items-center justify-between border-b border-brand/10 pb-3 sm:pb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/50">
                Live preview
              </p>
              <div className="flex gap-2">
                {(["front", "back"] as const).map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => switchView(side)}
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

            <TeePreview
              key={activeView}
              view={activeView}
              colorHex={selectedColor.hex}
              side={currentSide}
              activeLayer={activeLayer}
              onActiveLayerChange={setActiveLayer}
              onImagePlacementChange={(imagePlacement) =>
                setCurrentSide((current) => ({ ...current, imagePlacement }))
              }
              onTextPlacementChange={(placement) =>
                setCurrentSide((current) =>
                  current.text
                    ? { ...current, text: { ...current.text, placement } }
                    : current,
                )
              }
              onRemoveImage={currentSide.image ? handleRemoveImage : undefined}
              onRemoveText={
                currentSide.text?.content.trim() ? handleRemoveText : undefined
              }
              className="w-full"
            />

            <div className="hidden grid-cols-2 gap-4 lg:grid">
              {(["front", "back"] as const).map((side) => {
                const sideData = side === "front" ? front : back;
                return (
                  <button
                    key={side}
                    type="button"
                    onClick={() => switchView(side)}
                    className={cn(
                      "overflow-hidden border p-3 text-left transition-colors",
                      activeView === side
                        ? "border-brand/40 bg-brand/[0.03]"
                        : "border-brand/10 bg-brand/[0.02] hover:border-brand/25",
                    )}
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-brand/45">
                      {side} {sideHasPrint(sideData) ? "· ready" : ""}
                    </p>
                    <div className="pointer-events-none mx-auto mt-1 h-36 max-w-[9rem] overflow-hidden">
                      <TeePreview
                        view={side}
                        colorHex={selectedColor.hex}
                        side={sideData}
                        activeLayer={null}
                        onImagePlacementChange={() => {}}
                        onTextPlacementChange={() => {}}
                        interactive={false}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[var(--mobile-nav-height)] z-30 border-t border-brand/10 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/50">
              Total
            </p>
            <p className="text-lg font-semibold text-brand">
              {formatGhs(price * quantity)}
            </p>
          </div>
          <button
            type="button"
            disabled={!canAdd || adding}
            onClick={(event) => handleAddToBag(event.currentTarget)}
            className={cn(
              "shrink-0 border px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition-opacity",
              canAdd && !adding
                ? "border-brand bg-brand text-white hover:opacity-90"
                : "cursor-not-allowed border-brand/20 text-brand/35",
            )}
          >
            {adding ? "Adding…" : "Add to bag"}
          </button>
        </div>
      </div>
    </div>
  );
}
