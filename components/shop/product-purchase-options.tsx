"use client";

import { useCart } from "@/context/cart-context";
import type { Product, ProductColor, ProductSize } from "@/data/products";
import { PRODUCT_SIZES } from "@/data/products";
import { cn } from "@/lib/cn";
import { useRef, useState } from "react";
import { QuantitySelector } from "./quantity-selector";
import { WishlistButton } from "./wishlist-button";

type ProductPurchaseOptionsProps = {
  product: Product;
};

function SizeSelector({
  selected,
  onSelect,
}: {
  selected: ProductSize | null;
  onSelect: (size: ProductSize) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
        Size
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {PRODUCT_SIZES.map((size) => {
          const isActive = selected === size;

          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelect(size)}
              className={cn(
                "min-w-[3rem] border px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
                isActive
                  ? "border-brand bg-brand text-white"
                  : "border-brand/25 text-brand hover:border-brand",
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ColorSwatches({
  colors,
  selected,
  onSelect,
}: {
  colors: ProductColor[];
  selected: ProductColor | null;
  onSelect: (color: ProductColor) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
        Color
        {selected ? (
          <span className="ml-2 font-medium normal-case tracking-normal text-brand/60">
            — {selected.name}
          </span>
        ) : null}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {colors.map((color) => {
          const isActive = selected?.id === color.id;
          const isLight = color.hex.toLowerCase() === "#ffffff";

          return (
            <button
              key={color.id}
              type="button"
              title={color.name}
              aria-label={color.name}
              onClick={() => onSelect(color)}
              className={cn(
                "h-9 w-9 rounded-full border-2 transition-transform hover:scale-105",
                isActive ? "border-brand ring-2 ring-brand/25" : "border-brand/20",
                isLight && "shadow-[inset_0_0_0_1px_rgba(139,58,31,0.15)]",
              )}
              style={{ backgroundColor: color.hex }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function ProductPurchaseOptions({ product }: ProductPurchaseOptionsProps) {
  const { addToCart } = useCart();
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [size, setSize] = useState<ProductSize | null>(null);
  const [color, setColor] = useState<ProductColor | null>(
    product.colors?.[0] ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const canAdd =
    size !== null && (!product.colors?.length || color !== null);

  async function handleAddToBag() {
    if (!canAdd || !size || adding) return;

    setAdding(true);
    try {
      await addToCart(
        {
          productSlug: product.slug,
          name: product.name,
          image: product.image,
          priceGhs: product.priceGhs,
          size,
          color,
          quantity,
        },
        addButtonRef.current,
      );
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="space-y-8">
      <SizeSelector selected={size} onSelect={setSize} />

      {product.colors?.length ? (
        <ColorSwatches
          colors={product.colors}
          selected={color}
          onSelect={setColor}
        />
      ) : null}

      <QuantitySelector value={quantity} onChange={setQuantity} />

      <div className="flex flex-wrap items-center gap-4">
        <button
          ref={addButtonRef}
          type="button"
          disabled={!canAdd || adding}
          onClick={handleAddToBag}
          className={cn(
            "min-w-[220px] border px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] transition-opacity",
            canAdd && !adding
              ? "border-brand bg-brand text-white hover:opacity-90"
              : "cursor-not-allowed border-brand/20 text-brand/35",
          )}
        >
          {adding ? "Adding…" : "Add to bag"}
        </button>

        <div className="flex items-center gap-2">
          <WishlistButton productSlug={product.slug} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/50">
            Wishlist
          </span>
        </div>
      </div>
    </div>
  );
}
