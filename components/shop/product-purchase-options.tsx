"use client";

import { useCart } from "@/context/cart-context";
import {
  isProductSoldOut,
  PRODUCT_SIZES,
  type Product,
  type ProductColor,
  type ProductSize,
} from "@/data/products";
import { getMaxPurchaseQuantity } from "@/lib/product-inventory";
import { getCatalogProductBySlug } from "@/lib/product-catalog";
import { cn } from "@/lib/cn";
import { toast } from "@/lib/toast";
import { useEffect, useRef, useState } from "react";
import { subscribeCatalog } from "@/lib/product-catalog";
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
  const [catalogVersion, setCatalogVersion] = useState(0);

  useEffect(() => subscribeCatalog(() => setCatalogVersion((v) => v + 1)), []);

  const live = getCatalogProductBySlug(product.slug) ?? product;
  void catalogVersion;
  const soldOut = isProductSoldOut(live);
  const maxQty = getMaxPurchaseQuantity(live);

  const canAdd =
    !soldOut &&
    maxQty > 0 &&
    size !== null &&
    (!product.colors?.length || color !== null);

  async function handleAddToBag() {
    if (adding || soldOut) return;

    if (!size) {
      toast.warning("Select a size", {
        description: "Choose your size before adding to bag.",
      });
      return;
    }

    if (product.colors?.length && !color) {
      toast.warning("Select a color", {
        description: "Choose a color before adding to bag.",
      });
      return;
    }

    if (quantity > maxQty) {
      toast.warning("Not enough stock", {
        description: `Only ${maxQty} available.`,
      });
      return;
    }

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
      toast.success("Added to bag", {
        description: `${product.name} · Size ${size}${quantity > 1 ? ` · ×${quantity}` : ""}`,
      });
    } finally {
      setAdding(false);
    }
  }

  if (soldOut) {
    return (
      <div className="border border-brand/15 bg-brand/[0.03] px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand/55">
          Sold out
        </p>
        <p className="mt-2 text-sm text-brand/60">
          This item is currently unavailable. Check back soon.
        </p>
      </div>
    );
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

      <QuantitySelector
        value={quantity}
        onChange={setQuantity}
        max={maxQty}
      />

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
          {adding ? "Adding…" : maxQty <= 5 ? `Add to bag · ${maxQty} left` : "Add to bag"}
        </button>

        <div className="flex items-center gap-2">
          <WishlistButton productSlug={product.slug} productName={product.name} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/50">
            Wishlist
          </span>
        </div>
      </div>
    </div>
  );
}
