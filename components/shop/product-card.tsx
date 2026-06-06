"use client";

import { ProductMedia } from "@/components/shop/product-media";
import { isProductSoldOut, type Product } from "@/data/products";
import { formatGhs } from "@/lib/format-ghs";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { WishlistButton } from "./wishlist-button";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const soldOut = isProductSoldOut(product);
  const isMockup = product.image.startsWith("/mockups");

  return (
    <div className="group relative">
      <WishlistButton
        productSlug={product.slug}
        productName={product.name}
        className="absolute right-2 top-2 z-10 bg-white/90"
      />
      <Link href={`/shop/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <ProductMedia
            front={product.image}
            back={product.imageBack}
            alt={product.name}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            contain={isMockup}
            hoverFlipOnly
            className={cn(soldOut && "opacity-50")}
          />
          {soldOut ? (
            <span className="absolute inset-0 z-10 flex items-center justify-center bg-white/40">
              <span className="border border-brand bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
                Sold out
              </span>
            </span>
          ) : null}
        </div>
        <div className="mt-5 border-t border-brand/10 pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {product.name}
          </h3>
          <p className="mt-2 text-sm font-semibold text-brand">
            {soldOut ? (
              <span className="text-brand/45">Sold out</span>
            ) : (
              formatGhs(product.priceGhs)
            )}
          </p>
        </div>
      </Link>
    </div>
  );
}
