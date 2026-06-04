"use client";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { useCart } from "@/context/cart-context";
import { paymentOnDelivery } from "@/data/checkout";
import { formatGhs } from "@/lib/format-ghs";

export function CheckoutSummary() {
  const { items } = useCart();

  const subtotal = items.reduce(
    (sum, line) => sum + line.priceGhs * line.quantity,
    0,
  );

  return (
    <aside className="border border-brand/10 bg-brand/[0.02] p-6 lg:p-8">
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
        Order summary
      </h2>
      <ul className="mt-6 divide-y divide-brand/10">
        {items.map((line) => (
          <CartLineItem key={line.lineId} line={line} compact />
        ))}
      </ul>

      <div className="mt-6 space-y-3 border-t border-brand/10 pt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-brand/60">Subtotal</span>
          <span className="font-semibold text-brand">{formatGhs(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-brand/60">Delivery fee</span>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand/50">
            Nationwide · confirmed on call
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-brand/10 pt-6">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
          Total due on delivery
        </span>
        <span className="text-lg font-semibold text-brand">
          {formatGhs(subtotal)}
        </span>
      </div>

      <div className="mt-8 border border-brand/15 bg-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand">
          {paymentOnDelivery.label}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-brand/65">
          {paymentOnDelivery.description}
        </p>
      </div>
    </aside>
  );
}
