"use client";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { AppToaster } from "@/components/ui/app-toaster";
import { WishlistDrawer } from "@/components/wishlist/wishlist-drawer";
import { AdminProvider } from "@/context/admin-context";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { UploadThingSSR } from "@/components/upload/uploadthing-ssr";
import { WishlistProvider } from "@/context/wishlist-context";
import { useEffect } from "react";
import { initCatalogFromDb } from "@/lib/product-catalog";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initCatalogFromDb().catch(console.error);
  }, []);

  return (
    <AuthProvider>
      <AdminProvider>
        <WishlistProvider>
          <CartProvider>
            <UploadThingSSR />
            {children}
          <AppToaster />
          <WishlistDrawer />
          <CartDrawer />
          </CartProvider>
        </WishlistProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
