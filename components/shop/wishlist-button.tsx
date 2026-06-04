"use client";

import { useWishlist } from "@/context/wishlist-context";
import { cn } from "@/lib/cn";
import { Heart } from "lucide-react";

type WishlistButtonProps = {
  productSlug: string;
  className?: string;
  iconClassName?: string;
};

export function WishlistButton({
  productSlug,
  className,
  iconClassName,
}: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const active = isWishlisted(productSlug);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productSlug);
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
