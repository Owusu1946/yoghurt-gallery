"use client";

import { CartLineItem } from "@/components/cart/cart-line-item";
import { useCart } from "@/context/cart-context";
import { formatGhs } from "@/lib/format-ghs";
import { cn } from "@/lib/cn";
import { toast } from "@/lib/toast";
import Link from "next/link";

type CartContentsProps = {
  variant?: "page" | "drawer";
  onClose?: () => void;
};

export function CartContents({ variant = "page", onClose }: CartContentsProps) {
  const { items, itemCount, hydrated, removeLine, clearCart } = useCart();

  const subtotal = items.reduce(
    (sum, line) => sum + line.priceGhs * line.quantity,
    0,
  );

  function handleRemoveLine(lineId: string) {
    const line = items.find((item) => item.lineId === lineId);
    removeLine(lineId);
    toast.info("Removed from bag", {
      description: line?.name ?? "Item removed.",
    });
  }

  function handleClearCart() {
    clearCart();
    toast.info("Bag cleared", {
      description: "All items have been removed.",
    });
  }

  if (!hydrated) {
    return null;
  }

  const isDrawer = variant === "drawer";

  return (
    <div className={cn("flex flex-col", isDrawer && "h-full min-h-0")}>
      {!isDrawer ? (
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-brand">
              Bag
            </h1>
            <p className="mt-2 text-sm font-medium text-brand/60">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          {items.length > 0 ? (
            <button
              type="button"
              onClick={handleClearCart}
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/50 transition-opacity hover:text-brand"
            >
              Clear bag
            </button>
          ) : null}
        </div>
      ) : null}

      {items.length === 0 ? (
        <div
          className={cn(
            "text-center",
            isDrawer
              ? "flex flex-1 flex-col justify-center px-6"
              : "mt-12 border-t border-brand/10 pt-10",
          )}
        >
          <p className="text-sm font-medium text-brand/70">Your bag is empty.</p>
          {isDrawer && onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-brand transition-opacity hover:opacity-60"
            >
              Continue shopping
            </button>
          ) : (
            <Link
              href="/shop"
              className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.24em] text-brand transition-opacity hover:opacity-60"
            >
              Continue shopping
            </Link>
          )}
        </div>
      ) : (
        <>
          {isDrawer ? (
            <div className="flex shrink-0 items-center justify-end border-t border-brand/10 px-6 pt-4">
              <button
                type="button"
                onClick={handleClearCart}
                className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/50 transition-opacity hover:text-brand"
              >
                Clear bag
              </button>
            </div>
          ) : null}

          <ul
            className={cn(
              "divide-y divide-brand/10 border-brand/10",
              isDrawer
                ? "min-h-0 flex-1 overflow-y-auto border-t px-6"
                : "mt-10 border-t",
            )}
          >
            {items.map((line) => (
              <CartLineItem
                key={line.lineId}
                line={line}
                onRemove={handleRemoveLine}
              />
            ))}
          </ul>

          <div
            className={cn(
              "border-t border-brand/10 pt-6",
              isDrawer ? "shrink-0 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:px-6" : "mt-8",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                Subtotal
              </span>
              <span className="text-lg font-semibold text-brand">
                {formatGhs(subtotal)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="mt-6 block w-full border border-brand bg-brand px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
