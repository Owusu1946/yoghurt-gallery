"use client";

import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { formatGhs } from "@/lib/format-ghs";
import { useRouter } from "next/navigation";

export function CheckoutMobileBar() {
  const router = useRouter();
  const { items } = useCart();
  const { isAuthenticated } = useAuth();

  const subtotal = items.reduce(
    (sum, line) => sum + line.priceGhs * line.quantity,
    0,
  );

  function handlePlaceOrder() {
    const form = document.getElementById("checkout-form") as HTMLFormElement | null;
    if (form) {
      form.requestSubmit();
      return;
    }

    if (!isAuthenticated) {
      router.push(
        `/account/sign-up?returnTo=${encodeURIComponent("/checkout")}`,
      );
    }
  }

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(3.25rem+env(safe-area-inset-bottom))] z-30 border-t border-brand/10 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/45">
            Total on delivery
          </p>
          <p className="text-lg font-semibold text-brand">{formatGhs(subtotal)}</p>
        </div>
        <button
          type="button"
          onClick={handlePlaceOrder}
          className="shrink-0 border border-brand bg-brand px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white"
        >
          {isAuthenticated ? "Place order" : "Sign up & order"}
        </button>
      </div>
    </div>
  );
}
