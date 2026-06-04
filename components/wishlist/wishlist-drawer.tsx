"use client";

import { useWishlist } from "@/context/wishlist-context";
import { Sheet } from "@/components/ui/sheet";
import { WishlistContents } from "./wishlist-contents";

export function WishlistDrawer() {
  const { isDrawerOpen, closeDrawer, count, hydrated } = useWishlist();

  if (!hydrated) {
    return null;
  }

  return (
    <Sheet
      open={isDrawerOpen}
      onClose={closeDrawer}
      title="Wishlist"
      subtitle={`${count} ${count === 1 ? "item" : "items"}`}
      ariaLabel="Wishlist"
    >
      <WishlistContents variant="drawer" onClose={closeDrawer} />
    </Sheet>
  );
}
