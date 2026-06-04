"use client";

import type { ProductColor, ProductSize } from "@/data/products";
import type { CustomTeeDesign } from "@/data/customizer";
import { CART_STORAGE_KEY, readStorage, writeStorage } from "@/lib/storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartLine = {
  lineId: string;
  productSlug: string;
  name: string;
  image: string;
  priceGhs: number;
  size: ProductSize;
  colorId?: string;
  colorName?: string;
  quantity: number;
  customTee?: CustomTeeDesign;
};

type AddToCartInput = {
  productSlug: string;
  name: string;
  image: string;
  priceGhs: number;
  size: ProductSize;
  color?: ProductColor | null;
  quantity?: number;
  customTee?: CustomTeeDesign;
};

type AddCustomTeeInput = {
  name: string;
  image: string;
  priceGhs: number;
  size: ProductSize;
  quantity: number;
  customTee: CustomTeeDesign;
};

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  cartPulse: boolean;
  hydrated: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (input: AddToCartInput, sourceEl: HTMLElement | null) => Promise<void>;
  addCustomTeeToCart: (
    input: AddCustomTeeInput,
    sourceEl: HTMLElement | null,
  ) => Promise<void>;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function buildLineId(
  slug: string,
  size: ProductSize,
  colorId?: string,
): string {
  return `${slug}__${size}__${colorId ?? "default"}`;
}

function runFlyAnimation(
  image: string,
  sourceEl: HTMLElement,
): Promise<void> {
  return new Promise((resolve) => {
    const cartTarget =
      document.getElementById("nav-cart-target") ??
      document.getElementById("nav-cart-target-mobile");
    if (!cartTarget) {
      resolve();
      return;
    }

    const from = sourceEl.getBoundingClientRect();
    const to = cartTarget.getBoundingClientRect();
    const size = 48;

    const overlay = document.createElement("div");
    overlay.setAttribute("aria-hidden", "true");
    overlay.className =
      "pointer-events-none fixed z-[200] overflow-hidden rounded-sm border border-brand/20 bg-white shadow-sm";
    overlay.style.width = `${size}px`;
    overlay.style.height = `${size}px`;
    overlay.style.left = `${from.left + from.width / 2 - size / 2}px`;
    overlay.style.top = `${from.top + from.height / 2 - size / 2}px`;
    overlay.style.transition =
      "left 0.65s cubic-bezier(0.22, 1, 0.36, 1), top 0.65s cubic-bezier(0.22, 1, 0.36, 1), width 0.65s ease, height 0.65s ease, opacity 0.65s ease";

    const img = document.createElement("img");
    img.src = image;
    img.alt = "";
    img.className = "h-full w-full object-cover";
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const endSize = 18;
        overlay.style.left = `${to.left + to.width / 2 - endSize / 2}px`;
        overlay.style.top = `${to.top + to.height / 2 - endSize / 2}px`;
        overlay.style.width = `${endSize}px`;
        overlay.style.height = `${endSize}px`;
        overlay.style.opacity = "0.5";
      });
    });

    window.setTimeout(() => {
      overlay.remove();
      resolve();
    }, 680);
  });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  useEffect(() => {
    setItems(readStorage<CartLine[]>(CART_STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(CART_STORAGE_KEY, items);
  }, [items, hydrated]);

  const itemCount = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items],
  );

  const pulseCart = useCallback(() => {
    setCartPulse(true);
    window.setTimeout(() => setCartPulse(false), 350);
  }, []);

  const addToCart = useCallback(
    async (input: AddToCartInput, sourceEl: HTMLElement | null) => {
      const quantity = Math.max(1, input.quantity ?? 1);

      if (sourceEl) {
        await runFlyAnimation(input.image, sourceEl);
      }

      const lineId = buildLineId(
        input.productSlug,
        input.size,
        input.color?.id,
      );

      setItems((current) => {
        const existing = current.find((line) => line.lineId === lineId);
        if (existing) {
          return current.map((line) =>
            line.lineId === lineId
              ? { ...line, quantity: line.quantity + quantity }
              : line,
          );
        }

        return [
          ...current,
          {
            lineId,
            productSlug: input.productSlug,
            name: input.name,
            image: input.image,
            priceGhs: input.priceGhs,
            size: input.size,
            colorId: input.color?.id,
            colorName: input.color?.name,
            quantity,
            customTee: input.customTee,
          },
        ];
      });

      pulseCart();
    },
    [pulseCart],
  );

  const addCustomTeeToCart = useCallback(
    async (input: AddCustomTeeInput, sourceEl: HTMLElement | null) => {
      if (sourceEl) {
        await runFlyAnimation(input.image, sourceEl);
      }

      const lineId = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setItems((current) => [
        ...current,
        {
          lineId,
          productSlug: "custom-tee",
          name: input.name,
          image: input.image,
          priceGhs: input.priceGhs,
          size: input.size,
          colorId: input.customTee.colorId,
          colorName: input.customTee.colorName,
          quantity: input.quantity,
          customTee: input.customTee,
        },
      ]);

      pulseCart();
    },
    [pulseCart],
  );

  const removeLine = useCallback((lineId: string) => {
    setItems((current) => current.filter((line) => line.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      cartPulse,
      hydrated,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      addToCart,
      addCustomTeeToCart,
      removeLine,
      clearCart,
    }),
    [
      items,
      itemCount,
      cartPulse,
      hydrated,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      addToCart,
      addCustomTeeToCart,
      removeLine,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
