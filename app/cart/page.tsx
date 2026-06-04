"use client";

import { CartContents } from "@/components/cart/cart-contents";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { useCart } from "@/context/cart-context";
import { useEffect } from "react";

export default function CartPage() {
  const { openDrawer, hydrated } = useCart();

  useEffect(() => {
    if (!hydrated) return;
    openDrawer();
  }, [hydrated, openDrawer]);

  return (
    <div className="page-shell mx-auto max-w-3xl flex-1 px-4 py-6 sm:px-6 lg:py-16">
      <CheckoutSteps current="bag" />
      <div className="hidden lg:block">
        <CartContents variant="page" />
      </div>
      <p className="mt-8 text-center text-sm text-brand/55 lg:hidden">
        Your bag opens in the panel below.
      </p>
    </div>
  );
}
