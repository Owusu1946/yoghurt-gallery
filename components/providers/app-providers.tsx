"use client";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { AppToaster } from "@/components/ui/app-toaster";
import { WishlistDrawer } from "@/components/wishlist/wishlist-drawer";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          {children}
          <AppToaster />
          <WishlistDrawer />
          <CartDrawer />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
