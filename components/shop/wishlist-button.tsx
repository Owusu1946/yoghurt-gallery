"use client";

import { useWishlist } from "@/context/wishlist-context";
import { getProductBySlug } from "@/data/products";
import { cn } from "@/lib/cn";
import { toast } from "@/lib/toast";
import { Heart } from "lucide-react";

type WishlistButtonProps = {
  productSlug: string;
  productName?: string;
  className?: string;
  iconClassName?: string;
};

export function WishlistButton({
  productSlug,
  productName,
  className,
  iconClassName,
}: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const active = isWishlisted(productSlug);
  const name = productName ?? getProductBySlug(productSlug)?.name ?? "Item";

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const willSave = !active;
        toggleWishlist(productSlug);
        if (willSave) {
          toast.success("Saved to wishlist", { description: name });
        } else {
          toast.info("Removed from wishlist", { description: name });
        }
      }}
      className={cn(
        "flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70",
        className,
      )}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          active ? "fill-brand text-brand" : "text-brand",
          iconClassName,
        )}
        strokeWidth={1.25}
      />
    </button>
  );
}
