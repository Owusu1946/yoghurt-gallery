"use client";

import { mainNavLinks } from "@/data/navigation";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { navIconProps } from "./nav-icon";

export function NavbarMobile() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const menuPanel =
    mounted && open
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] flex flex-col bg-white lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-brand/10 px-4 pt-[env(safe-area-inset-top)]">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center text-brand"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X {...navIconProps} />
              </button>
              <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand">
                Menu
              </span>
              <span className="h-10 w-10" aria-hidden />
            </header>

            <nav className="flex-1 overflow-y-auto px-4 py-2">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block border-b border-brand/10 py-4 text-[11px] font-medium uppercase tracking-[0.26em] text-brand active:opacity-60"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center text-brand transition-opacity hover:opacity-60 lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu {...navIconProps} />
      </button>
      {menuPanel}
    </>
  );
}
