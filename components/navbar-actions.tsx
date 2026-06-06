"use client";

import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { cn } from "@/lib/cn";
import { Heart, LayoutDashboard, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { NavBadge } from "./nav-badge";
import { navIconProps } from "./nav-icon";
import { useAdmin } from "@/context/admin-context";
import { useAuth } from "@/context/auth-context";

function NavIconLink({
  href,
  label,
  children,
  id,
  badge,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  id?: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      id={id}
      className="relative flex h-10 w-10 items-center justify-center text-brand transition-opacity hover:opacity-60"
      aria-label={badge ? `${label}, ${badge} items` : label}
    >
      {children}
      {badge !== undefined ? <NavBadge count={badge} /> : null}
    </Link>
  );
}

function AccountNavControl() {
  const { isAuthenticated, user, hydrated } = useAuth();

  if (!hydrated) {
    return (
      <NavIconLink href="/account/sign-in" label="Account">
        <User {...navIconProps} />
      </NavIconLink>
    );
  }

  if (isAuthenticated && user) {
    const initial = user.fullName.trim().charAt(0).toUpperCase() || "Y";

    return (
      <Link
        href="/account"
        className="relative flex h-10 w-10 items-center justify-center text-brand transition-opacity hover:opacity-60"
        aria-label={`Account, signed in as ${user.fullName}`}
      >
        <span className="flex h-8 w-8 items-center justify-center border border-brand bg-brand text-[11px] font-semibold uppercase tracking-wide text-white">
          {initial}
        </span>
        <span
          className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full border border-white bg-brand"
          aria-hidden
        />
      </Link>
    );
  }

  return (
    <NavIconLink href="/account/sign-in" label="Sign in">
      <User {...navIconProps} />
    </NavIconLink>
  );
}

function CartNavControl({
  badge,
  pulse,
}: {
  badge: number;
  pulse: boolean;
}) {
  const { openDrawer } = useCart();

  return (
    <>
      <button
        type="button"
        id="nav-cart-target"
        onClick={openDrawer}
        className="relative hidden h-10 w-10 items-center justify-center text-brand transition-opacity hover:opacity-60 lg:flex"
        aria-label={badge ? `Shopping bag, ${badge} items` : "Shopping bag"}
      >
        <span
          className={cn(
            "transition-transform duration-300",
            pulse && "scale-125",
          )}
        >
          <ShoppingBag {...navIconProps} />
        </span>
        <NavBadge count={badge} />
      </button>
    </>
  );
}

function WishlistNavControl({ badge }: { badge: number }) {
  const { openDrawer } = useWishlist();

  return (
    <button
      type="button"
      id="nav-wishlist-target"
      onClick={openDrawer}
      className="relative hidden h-10 w-10 items-center justify-center text-brand transition-opacity hover:opacity-60 lg:flex"
      aria-label={badge ? `Wishlist, ${badge} items` : "Wishlist"}
    >
      <Heart {...navIconProps} />
      <NavBadge count={badge} />
    </button>
  );
}

export function NavbarActions() {
  const { itemCount, cartPulse, hydrated: cartReady } = useCart();
  const { count: wishlistCount, hydrated: wishlistReady } = useWishlist();
  const { isAdmin, hydrated: adminReady } = useAdmin();

  const cartBadge = cartReady ? itemCount : 0;
  const wishBadge = wishlistReady ? wishlistCount : 0;

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {adminReady && isAdmin ? (
        <NavIconLink href="/admin" label="Admin dashboard">
          <LayoutDashboard {...navIconProps} />
        </NavIconLink>
      ) : null}
      <NavIconLink href="/search" label="Search">
        <Search {...navIconProps} />
      </NavIconLink>
      <div className="hidden lg:contents">
        <AccountNavControl />
        <WishlistNavControl badge={wishBadge} />
        <CartNavControl badge={cartBadge} pulse={cartPulse} />
      </div>
    </div>
  );
}
