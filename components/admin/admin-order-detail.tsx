"use client";

import { AdminCustomTeePanel } from "@/components/admin/admin-custom-tee-panel";
import { AdminShell } from "@/components/admin/admin-shell";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { OrderTracker } from "@/components/account/order-tracker";
import {
  orderStatusLabels,
  orderTrackingSteps,
  type OrderStatus,
} from "@/data/order-status";
import { getOrderFromDb, updateOrderStatusInDb } from "@/app/actions/admin-orders";
import { createBrowserClient } from "@supabase/ssr";
import type { OrderCustomer } from "@/lib/orders";
import type { CartLine } from "@/context/cart-context";
import {
  clearOrderStatusOverride,
  getEffectiveOrderStatus,
  setOrderStatusOverride,
} from "@/lib/admin-order-status";
import { formatGhs } from "@/lib/format-ghs";
import { formatCustomerDelivery } from "@/lib/orders";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { useEffect, useState } from "react";

type AdminOrderDetailProps = {
  orderId: string;
};

function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function AdminOrderDetail({ orderId }: AdminOrderDetailProps) {
  const [status, setStatus] = useState<string>("confirmed");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const dbOrder = await getOrderFromDb(decodeURIComponent(orderId));
      setOrder(dbOrder);
      if (dbOrder) {
        setStatus(dbOrder.status);
      }
    }
    
    loadData();

    // Supabase Realtime Subscription
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel(`admin-order-${orderId}`)
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
  }, [orderId]);

  if (!order) {
    return (
      <AdminShell>
        <Link
          href="/admin/orders"
          className="text-xs font-semibold uppercase tracking-[0.22em] text-brand/60 hover:text-brand"
        >
          ← Back to orders
        </Link>
      </AdminShell>
    );
  }

  const customer = order.customer as OrderCustomer;
  const delivery = formatCustomerDelivery(customer);

  async function updateStatus(next: string) {
    setStatus(next);
    await updateOrderStatusInDb(order.id, next);
  }

  return (
    <AdminShell>
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/55 hover:text-brand"
      >
        ← Orders
      </Link>
      <p className="mb-6 text-sm text-brand/60">
        {customer.fullName} · {order.id} · {formatOrderDate(order.createdAt)}
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="border border-brand/10 p-4 sm:p-5">
            <ul className="divide-y divide-brand/10">
              {(order.lines as CartLine[]).map((line) => (
                <CartLineItem key={line.lineId} line={line} compact />
              ))}
            </ul>
            <div className="mt-5 flex justify-between border-t border-brand/10 pt-4 text-sm">
              <span className="text-brand/60">Subtotal</span>
              <span className="font-semibold text-brand">
                {formatGhs(order.subtotal)}
              </span>
            </div>
          </section>

          {(order.lines as CartLine[])
            .filter((line) => line.customTee)
            .map((line) => (
              <AdminCustomTeePanel
                key={line.lineId}
                lineId={line.lineId}
                name={line.name}
                size={line.size}
                quantity={line.quantity}
                design={line.customTee!}
              />
            ))}

          <section className="border border-brand/10 p-4 sm:p-5">
            <div className="space-y-2 text-sm text-brand/70">
              <p className="font-semibold text-brand">{delivery.summary}</p>
              {delivery.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {customer.landmark ? (
                <p>
                  <span className="text-brand/50">Landmark: </span>
                  {customer.landmark}
                </p>
              ) : null}
              {customer.notes ? (
                <p>
                  <span className="text-brand/50">Notes: </span>
                  {customer.notes}
                </p>
              ) : null}
            </div>
          </section>

          <section className="border border-brand/10 p-4 sm:p-5">
            <dl className="space-y-2 text-sm text-brand/70">
              <div>
                <dt className="text-brand/50">Name</dt>
                <dd className="font-medium text-brand">{customer.fullName}</dd>
              </div>
              <div>
                <dt className="text-brand/50">Phone</dt>
                <dd>{customer.phone}</dd>
              </div>
              <div>
                <dt className="text-brand/50">Email</dt>
                <dd>{customer.email}</dd>
              </div>
              <div>
                <dt className="text-brand/50">Payment</dt>
                <dd>{order.paymentLabel}</dd>
              </div>
            </dl>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="border border-brand/10 p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
              {orderTrackingSteps.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => updateStatus(step.id)}
                  className={cn(
                    "border px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors",
                    status === step.id
                      ? "border-brand bg-brand text-white"
                      : "border-brand/15 text-brand/55 hover:border-brand/35",
                  )}
                >
                  {orderStatusLabels[step.id]}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setStatus(order.status);
              }}
              className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/45 hover:text-brand"
            >
              Reset to DB Status
            </button>
          </section>

          <section className="border border-brand/10 p-4 sm:p-5">
            <OrderTracker createdAt={order.createdAt} status={status as OrderStatus} />
          </section>
        </aside>
      </div>
    </AdminShell>
  );
}
