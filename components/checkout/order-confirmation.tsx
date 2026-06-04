"use client";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { paymentOnDelivery } from "@/data/checkout";
import { formatGhs } from "@/lib/format-ghs";
import {
  formatCustomerDelivery,
  type LegacyOrderCustomer,
  type PlacedOrder,
} from "@/lib/orders";
import {
  LAST_ORDER_STORAGE_KEY,
  PENDING_ORDER_REF_KEY,
  readSessionStorage,
  readStorage,
  removeSessionStorage,
} from "@/lib/storage";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { saveUserOrder } from "@/lib/order-history";
import { toStoredOrder } from "@/lib/order-storage";
import type { StoredOrder } from "@/lib/orders";

function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function DeliveryDetails({
  customer,
}: {
  customer: LegacyOrderCustomer;
}) {
  const { summary, addressLines } = formatCustomerDelivery(customer);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/45">
          Location
        </p>
        <p className="mt-1 text-sm font-semibold text-brand">{summary}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/45">
          Address
        </p>
        {addressLines.map((line) => (
          <p key={line} className="mt-1 text-sm leading-relaxed text-brand/65">
            {line}
          </p>
        ))}
      </div>
      {customer.landmark ? (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/45">
            Closest landmark
          </p>
          <p className="mt-1 text-sm leading-relaxed text-brand/65">
            {customer.landmark}
          </p>
        </div>
      ) : null}
      {customer.notes ? (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/45">
            Order notes
          </p>
          <p className="mt-1 text-sm leading-relaxed text-brand/55">
            {customer.notes}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function OrderConfirmation() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const pendingRef = readSessionStorage<string | null>(
      PENDING_ORDER_REF_KEY,
      null,
    );
    const stored = readStorage<PlacedOrder | null>(LAST_ORDER_STORAGE_KEY, null);
    const orderRef = ref ?? pendingRef;

    if (stored && (!orderRef || stored.id === orderRef)) {
      setOrder(stored);
      clearCart();
      removeSessionStorage(PENDING_ORDER_REF_KEY);

      const userId = user?.id ?? (stored as StoredOrder).userId;
      if (userId) {
        saveUserOrder(toStoredOrder(stored, userId));
      }
    }
    setReady(true);
  }, [ref, clearCart, user?.id]);

  if (!ready) {
    return null;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center lg:py-20">
        <h1 className="font-display text-3xl font-semibold text-brand">
          Order not found
        </h1>
        <p className="mt-4 text-sm font-medium text-brand/60">
          We could not find a recent order on this device. If you already placed
          an order, check your confirmation message or contact us.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block border border-brand bg-brand px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const { customer } = order;

  return (
    <div className="page-shell mx-auto max-w-3xl px-4 py-8 pb-24 sm:px-6 lg:py-16 lg:pb-16">
      <CheckoutSteps current="confirmation" />

      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/50">
        Thank you
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-brand sm:text-4xl">
        Order confirmed
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-brand/65">
        Reference{" "}
        <span className="font-semibold text-brand">{order.id}</span> ·{" "}
        {formatOrderDate(order.createdAt)}
      </p>

      <div className="mt-6 border border-brand/15 bg-brand/[0.03] px-5 py-4">
        <p className="text-sm leading-relaxed text-brand/70">
          We will call{" "}
          <span className="font-semibold text-brand">{customer.phone}</span> to
          confirm your order, delivery timing, and any delivery fee outside
          Accra.
        </p>
      </div>

      <div className="mt-10 grid gap-8 border border-brand/10 bg-brand/[0.02] p-6 sm:grid-cols-2 sm:p-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand/50">
            Deliver to
          </p>
          <p className="mt-2 text-sm font-semibold text-brand">
            {customer.fullName}
          </p>
          {customer.email ? (
            <p className="mt-1 text-sm text-brand/55">{customer.email}</p>
          ) : null}
          <div className="mt-5">
            <DeliveryDetails customer={customer} />
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand/50">
              Payment
            </p>
            <p className="mt-2 text-sm font-semibold text-brand">
              {paymentOnDelivery.label}
            </p>
            <p className="mt-1 text-sm text-brand/65">
              {formatGhs(order.subtotal)} estimated · final total confirmed on
              call
            </p>
          </div>
          <div className="border-t border-brand/10 pt-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand/50">
              What happens next
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm leading-relaxed text-brand/65">
              <li>We review your items (including any custom prints).</li>
              <li>We call to confirm address, landmark, and delivery fee.</li>
              <li>Your order is prepared and sent to you.</li>
              <li>You pay on delivery when it arrives.</li>
            </ol>
          </div>
        </div>
      </div>

      <h2 className="mt-10 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
        Your items
      </h2>
      <ul className="mt-4 divide-y divide-brand/10 border-t border-brand/10">
        {order.lines.map((line) => (
          <CartLineItem key={line.lineId} line={line} compact />
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-brand/10 pt-6">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
          Subtotal
        </span>
        <span className="text-lg font-semibold text-brand">
          {formatGhs(order.subtotal)}
        </span>
      </div>
      <p className="mt-2 text-xs text-brand/50">
        Delivery fee (if any) is added after we confirm your location.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/account/orders/${encodeURIComponent(order.id)}`}
          className="inline-flex justify-center border border-brand bg-brand px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90"
        >
          Track order
        </Link>
        <Link
          href="/shop"
          className="inline-flex justify-center border border-brand/25 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-brand transition-colors hover:border-brand"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
