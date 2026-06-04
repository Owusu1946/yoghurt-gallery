"use client";

import { orderStatusLabels, type OrderStatus } from "@/data/order-status";
import { formatGhs } from "@/lib/format-ghs";
import type { StoredOrder } from "@/lib/orders";
import { cn } from "@/lib/cn";
import { ChevronRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type OrderCardProps = {
  order: StoredOrder;
  status: OrderStatus;
};

function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function OrderCard({ order, status }: OrderCardProps) {
  const itemCount = order.lines.reduce((sum, line) => sum + line.quantity, 0);
  const preview = order.lines[0];
  const isDataUrl = preview?.image.startsWith("data:");

  return (
    <Link
      href={`/account/orders/${encodeURIComponent(order.id)}`}
      className="flex gap-4 border border-brand/10 bg-white p-4 transition-colors hover:border-brand/25 active:bg-brand/[0.02]"
    >
      <div className="relative h-20 w-16 shrink-0 bg-brand/[0.03]">
        {preview ? (
          isDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview.image}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={preview.image}
              alt={preview.name}
              fill
              className="object-cover object-center"
              sizes="64px"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-brand/30">
            <Package className="h-6 w-6" strokeWidth={1.25} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/45">
              {order.id}
            </p>
            <p className="mt-1 text-sm font-semibold text-brand">
              {formatGhs(order.subtotal)}
              <span className="ml-2 font-medium text-brand/50">
                · {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </p>
            <p className="mt-1 text-xs text-brand/55">
              {formatOrderDate(order.createdAt)}
            </p>
          </div>
          <ChevronRight
            className="mt-1 h-4 w-4 shrink-0 text-brand/35"
            strokeWidth={1.25}
          />
        </div>
        <p
          className={cn(
            "mt-3 inline-block text-[10px] font-semibold uppercase tracking-[0.18em]",
            status === "delivered" ? "text-brand" : "text-brand/60",
          )}
        >
          {orderStatusLabels[status]}
        </p>
      </div>
    </Link>
  );
}
