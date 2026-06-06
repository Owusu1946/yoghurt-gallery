"use client";

import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { isAdminPath } from "@/data/admin-nav";
import { cn } from "@/lib/cn";
import { Heart, Home, ShoppingBag, Store, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavBadge } from "@/components/nav-badge";

const tabs = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/shop",
    label: "Shop",
    icon: Store,
    match: (p: string) => p.startsWith("/shop"),
  },
  {
    href: "/cart",
    label: "Bag",
    icon: ShoppingBag,
    match: (p: string) => p === "/cart" || p.startsWith("/checkout"),
    action: "cart" as const,
  },
  {
    href: "/wishlist",
    label: "Saved",
    icon: Heart,
    match: (p: string) => p === "/wishlist",
    action: "wishlist" as const,
  },
  {
    href: "/account",
    label: "Account",
    icon: User,
    match: (p: string) => p.startsWith("/account"),
    action: "account" as const,
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const { openDrawer: openCart, itemCount, hydrated: cartReady } = useCart();
  const { openDrawer: openWishlist, count, hydrated: wishReady } =
    useWishlist();
  const { isAuthenticated, user, hydrated: authReady } = useAuth();

  const cartBadge = cartReady ? itemCount : 0;
  const wishBadge = wishReady ? count : 0;

  if (isAdminPath(pathname)) {
    return null;
  }

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-brand/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match(pathname);
          const isCart = tab.action === "cart";
          const isWishlist = tab.action === "wishlist";
          const isAccount = tab.action === "account";

          const accountHref =
            authReady && isAuthenticated ? "/account" : "/account/sign-in";

          const badge = isCart ? cartBadge : isWishlist ? wishBadge : 0;

          const className = cn(
            "relative flex min-h-[3.25rem] min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors",
            active ? "text-brand" : "text-brand/45",
          );

          const iconEl = (
            <>
              <span className="relative flex h-5 w-5 items-center justify-center">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
                {badge > 0 ? (
                  <span className="absolute -right-2.5 -top-1.5">
                    <NavBadge count={badge} />
                  </span>
                ) : null}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em]">
                {tab.label}
              </span>
              {isAccount && isAuthenticated && user ? (
                <span className="absolute right-[calc(50%-1.25rem)] top-2 h-1.5 w-1.5 rounded-full bg-brand" />
              ) : null}
            </>
          );

          if (isCart) {
            return (
              <li key={tab.href}>
                <button
                  type="button"
                  id="nav-cart-target-mobile"
                  onClick={openCart}
                  className={className}
                >
                  {iconEl}
                </button>
              </li>
            );
          }

          if (isWishlist) {
            return (
              <li key={tab.href}>
                <button
                  type="button"
                  onClick={openWishlist}
                  className={className}
                >
                  {iconEl}
                </button>
              </li>
            );
          }

          return (
            <li key={tab.href}>
              <Link
                href={isAccount ? accountHref : tab.href}
                className={className}
              >
                {iconEl}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
