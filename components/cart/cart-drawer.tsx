"use client";

import { useCart } from "@/context/cart-context";
import { Sheet } from "@/components/ui/sheet";
import { CartContents } from "./cart-contents";

export function CartDrawer() {
  const { isDrawerOpen, closeDrawer, itemCount, hydrated } = useCart();

  if (!hydrated) {
    return null;
  }

  return (
    <Sheet
      open={isDrawerOpen}
      onClose={closeDrawer}
      title="Your bag"
      subtitle={`${itemCount} ${itemCount === 1 ? "item" : "items"}`}
      ariaLabel="Shopping bag"
    >
      <CartContents variant="drawer" onClose={closeDrawer} />
    </Sheet>
  );
}
