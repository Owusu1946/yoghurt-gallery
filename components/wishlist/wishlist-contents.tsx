"use client";

import { useWishlist } from "@/context/wishlist-context";
import { getProductBySlug } from "@/data/products";
import { formatGhs } from "@/lib/format-ghs";
import { cn } from "@/lib/cn";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

type WishlistContentsProps = {
  variant?: "page" | "drawer";
  onClose?: () => void;
};

function WishlistLineItem({
  slug,
  onRemove,
  onNavigate,
}: {
  slug: string;
  onRemove: (slug: string) => void;
  onNavigate?: () => void;
}) {
  const product = getProductBySlug(slug);
  if (!product) return null;

  const isMockup = product.image.startsWith("/mockups");

  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/shop/product/${product.slug}`}
        onClick={onNavigate}
        className="relative h-24 w-[4.5rem] shrink-0 bg-brand/[0.03]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={cn(
            "object-center",
            isMockup ? "object-contain p-1" : "object-cover",
          )}
          sizes="72px"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/shop/product/${product.slug}`}
              onClick={onNavigate}
              className="text-xs font-semibold uppercase tracking-[0.16em] text-brand transition-opacity hover:opacity-70"
            >
              {product.name}
            </Link>
            <p className="mt-2 text-sm font-semibold text-brand">
              {formatGhs(product.priceGhs)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(slug)}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-brand/45 transition-opacity hover:text-brand hover:opacity-100"
            aria-label={`Remove ${product.name} from wishlist`}
          >
            <X className="h-4 w-4" strokeWidth={1.25} />
          </button>
        </div>
      </div>
    </li>
  );
}

export function WishlistContents({
  variant = "page",
  onClose,
}: WishlistContentsProps) {
  const { slugs, count, hydrated, removeItem, clearWishlist } = useWishlist();

  const validSlugs = useMemo(
    () => slugs.filter((slug) => getProductBySlug(slug)),
    [slugs],
  );

  if (!hydrated) {
    return null;
  }

  const isDrawer = variant === "drawer";

  return (
    <div className={cn("flex flex-col", isDrawer && "h-full min-h-0")}>
      {!isDrawer ? (
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-brand">
              Wishlist
            </h1>
            <p className="mt-2 text-sm font-medium text-brand/60">
              {count} {count === 1 ? "item" : "items"} saved
            </p>
          </div>
          {validSlugs.length > 0 ? (
            <button
              type="button"
              onClick={clearWishlist}
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/50 transition-opacity hover:text-brand"
            >
              Clear wishlist
            </button>
          ) : null}
        </div>
      ) : null}

      {validSlugs.length === 0 ? (
        <div
          className={cn(
            "text-center",
            isDrawer
              ? "flex flex-1 flex-col justify-center px-6"
              : "mt-12 border-t border-brand/10 pt-10",
          )}
        >
          <p className="text-sm font-medium text-brand/70">
            No items in your wishlist yet.
          </p>
          {isDrawer && onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-brand transition-opacity hover:opacity-60"
            >
              Browse shop
            </button>
          ) : (
            <Link
              href="/shop"
              className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.24em] text-brand transition-opacity hover:opacity-60"
            >
              Browse shop
            </Link>
          )}
        </div>
      ) : (
        <>
          {isDrawer ? (
            <div className="flex shrink-0 items-center justify-end border-t border-brand/10 px-6 pt-4">
              <button
                type="button"
                onClick={clearWishlist}
                className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/50 transition-opacity hover:text-brand"
              >
                Clear wishlist
              </button>
            </div>
          ) : null}

          <ul
            className={cn(
              "divide-y divide-brand/10 border-brand/10",
              isDrawer
                ? "min-h-0 flex-1 overflow-y-auto border-t px-6"
                : "mt-10 border-t",
            )}
          >
            {validSlugs.map((slug) => (
              <WishlistLineItem
                key={slug}
                slug={slug}
                onRemove={removeItem}
                onNavigate={onClose}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
