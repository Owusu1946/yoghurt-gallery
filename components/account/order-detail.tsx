"use client";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { OrderTracker } from "@/components/account/order-tracker";
import { useAuth } from "@/context/auth-context";
import { paymentOnDelivery } from "@/data/checkout";
import { orderStatusLabels } from "@/data/order-status";
import { getEffectiveOrderStatus } from "@/lib/admin-order-status";
import { formatGhs } from "@/lib/format-ghs";
import { getUserOrder } from "@/lib/order-history";
import {
  formatCustomerDelivery,
  type LegacyOrderCustomer,
  type StoredOrder,
} from "@/lib/orders";
import { getUserOrderFromDb } from "@/app/actions/user-orders";
import { createBrowserClient } from "@supabase/ssr";
import type { OrderStatus } from "@/data/order-status";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type OrderDetailProps = {
  orderId: string;
};

function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function DeliveryBlock({ customer }: { customer: LegacyOrderCustomer }) {
  const { summary, addressLines } = formatCustomerDelivery(customer);

  return (
    <div className="space-y-3 text-sm text-brand/65">
      <p className="font-semibold text-brand">{summary}</p>
      {addressLines.map((line) => (
        <p key={line}>{line}</p>
      ))}
      {customer.landmark ? (
        <p>
          <span className="font-medium text-brand/50">Landmark: </span>
          {customer.landmark}
        </p>
      ) : null}
    </div>
  );
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  const router = useRouter();
  const { user, isAuthenticated, hydrated } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || !user) {
      router.replace("/account/sign-in");
      return;
    }

    async function loadData() {
      const dbOrder = await getUserOrderFromDb(user!.id, decodeURIComponent(orderId));
      setOrder(dbOrder);
      setReady(true);
    }
    
    loadData();

    // Supabase Realtime Subscription for user's order
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel(`user-order-${orderId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `id=eq.${decodeURIComponent(orderId)}` },
        (payload) => {
          loadData();
        }
      )
      .subscribe();

    window.addEventListener("yoghurt-admin-order-status", loadData);
    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("yoghurt-admin-order-status", loadData);
    };
  }, [hydrated, isAuthenticated, user, orderId, router]);

  if (!ready || !user) {
    return null;
  }

  if (!order) {
    return (
      <div className="page-shell mx-auto max-w-lg px-4 py-8 pb-24 sm:px-6">
        <Link
          href="/account"
          className="inline-flex min-h-10 items-center text-xs font-semibold uppercase tracking-[0.22em] text-brand/60 hover:text-brand"
        >
          ← Account
        </Link>
        <h1 className="mt-6 font-display text-2xl font-semibold text-brand">
          Order not found
        </h1>
        <p className="mt-3 text-sm text-brand/60">
          This order is not on your account. It may belong to another device or
          session.
        </p>
        <Link
          href="/account"
          className="mt-8 inline-block border border-brand bg-brand px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-white"
        >
          Back to account
        </Link>
      </div>
    );
  }

  const status = order.status;

  return (
    <div className="page-shell mx-auto max-w-lg px-4 py-6 pb-24 sm:px-6 lg:py-10">
      <Link
        href="/account"
        className="inline-flex min-h-10 items-center text-xs font-semibold uppercase tracking-[0.22em] text-brand/60 hover:text-brand"
      >
        ← Account
      </Link>

      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/50">
        Track order
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-brand sm:text-3xl">
        {order.id}
      </h1>
      <p className="mt-2 text-sm text-brand/60">
        Placed {formatOrderDate(order.createdAt)}
      </p>

      <div className="mt-6 inline-block border border-brand/15 bg-brand/[0.04] px-4 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/50">
          Status ·{" "}
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
          {orderStatusLabels[status as keyof typeof orderStatusLabels] || status}
        </span>
      </div>

      <section className="mt-10 border border-brand/10 bg-brand/[0.02] p-5 sm:p-6">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
          Delivery progress
        </h2>
        <div className="mt-6">
          <OrderTracker createdAt={order.createdAt} status={status} />
        </div>
        <p className="mt-2 text-xs leading-relaxed text-brand/45">
          Status updates automatically. We will call you if anything changes.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
          Deliver to
        </h2>
        <div className="mt-4 border border-brand/10 p-4">
          <p className="text-sm font-semibold text-brand">
            {order.customer.fullName}
          </p>
          <div className="mt-3">
            <DeliveryBlock customer={order.customer} />
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
          Items
        </h2>
        <ul className="mt-4 divide-y divide-brand/10 border-t border-brand/10">
          {(order.lines as any[]).map((line) => (
            <CartLineItem key={line.lineId} line={line} compact />
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-brand/10 pt-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Total on delivery
          </span>
          <span className="text-lg font-semibold text-brand">
            {formatGhs(order.subtotal)}
          </span>
        </div>
        <p className="mt-2 text-xs text-brand/50">
          {paymentOnDelivery.label} · {paymentOnDelivery.description}
        </p>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/shop"
          className="inline-flex justify-center border border-brand bg-brand px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-white"
        >
          Continue shopping
        </Link>
        <Link
          href="/contact"
          className="inline-flex justify-center border border-brand/25 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand"
        >
          Need help?
        </Link>
      </div>
    </div>
  );
}
