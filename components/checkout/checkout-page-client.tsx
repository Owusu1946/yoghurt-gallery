"use client";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutMobileBar } from "@/components/checkout/checkout-mobile-bar";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { useCart } from "@/context/cart-context";
import Link from "next/link";

export function CheckoutPageClient() {
  const { items, hydrated: cartReady } = useCart();

  if (!cartReady) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="page-shell mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <CheckoutSteps current="bag" />
        <p className="mt-10 text-sm font-medium text-brand/70">
          Your bag is empty.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.24em] text-brand transition-opacity hover:opacity-60"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="page-shell mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:py-16 lg:pb-16">
        <CheckoutSteps current="checkout" />
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <CheckoutForm />
          </div>
          <div className="hidden lg:col-span-5 lg:block">
            <CheckoutSummary />
          </div>
        </div>
      </div>
      <CheckoutMobileBar />
    </>
  );
}
