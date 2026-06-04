"use client";

import { WISHLIST_STORAGE_KEY, readStorage, writeStorage } from "@/lib/storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type WishlistContextValue = {
  slugs: string[];
  count: number;
  isWishlisted: (slug: string) => boolean;
  toggleWishlist: (slug: string) => void;
  removeItem: (slug: string) => void;
  clearWishlist: () => void;
  hydrated: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  useEffect(() => {
    setSlugs(readStorage<string[]>(WISHLIST_STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(WISHLIST_STORAGE_KEY, slugs);
  }, [slugs, hydrated]);

  const isWishlisted = useCallback(
    (slug: string) => slugs.includes(slug),
    [slugs],
  );

  const removeItem = useCallback((slug: string) => {
    setSlugs((current) => current.filter((s) => s !== slug));
  }, []);

  const clearWishlist = useCallback(() => {
    setSlugs([]);
  }, []);

  const toggleWishlist = useCallback((slug: string) => {
    setSlugs((current) =>
      current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug],
    );
  }, []);

  const value = useMemo(
    () => ({
      slugs,
      count: slugs.length,
      isWishlisted,
      toggleWishlist,
      removeItem,
      clearWishlist,
      hydrated,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
    }),
    [
      slugs,
      isWishlisted,
      toggleWishlist,
      removeItem,
      clearWishlist,
      hydrated,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return ctx;
}
