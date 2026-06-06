"use client";

import { useAuth } from "@/context/auth-context";
import { navIconProps } from "@/components/nav-icon";
import { Menu, Search, User, X } from "lucide-react";
import Link from "next/link";

function AdminAccountControl() {
  const { isAuthenticated, user, hydrated } = useAuth();

  if (!hydrated) {
    return (
      <Link
        href="/account/sign-in"
        className="flex h-10 w-10 items-center justify-center text-brand transition-opacity hover:opacity-60"
        aria-label="Account"
      >
        <User {...navIconProps} />
      </Link>
    );
  }

  if (isAuthenticated && user) {
    const initial = user.fullName.trim().charAt(0).toUpperCase() || "Y";
    return (
      <Link
        href="/account"
        className="flex h-10 w-10 items-center justify-center text-brand transition-opacity hover:opacity-60"
        aria-label={`Account, signed in as ${user.fullName}`}
      >
        <span className="flex h-8 w-8 items-center justify-center border border-brand bg-brand text-[11px] font-semibold uppercase tracking-wide text-white">
          {initial}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/account/sign-in"
      className="flex h-10 w-10 items-center justify-center text-brand transition-opacity hover:opacity-60"
      aria-label="Sign in"
    >
      <User {...navIconProps} />
    </Link>
  );
}

type AdminNavbarProps = {
  onMenuToggle: () => void;
  menuOpen: boolean;
};

export function AdminNavbar({ onMenuToggle, menuOpen }: AdminNavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-brand/15 bg-white/95 backdrop-blur-md">
      <div className="flex h-[var(--admin-nav-height)] items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-10 w-10 shrink-0 items-center justify-center text-brand lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X className="h-5 w-5" strokeWidth={1.5} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          )}
        </button>

        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <span className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/50">
            Welcome,
          </span>
          <span className="truncate font-display text-lg font-semibold text-brand sm:text-xl">
            Admin
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <Link
            href="/search"
            className="flex h-10 w-10 items-center justify-center text-brand transition-opacity hover:opacity-60"
            aria-label="Search"
          >
            <Search {...navIconProps} />
          </Link>
          <AdminAccountControl />
        </div>
      </div>
    </header>
  );
}
