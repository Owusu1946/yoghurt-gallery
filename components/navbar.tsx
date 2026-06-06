import { mainNavLinks } from "@/data/navigation";
import Link from "next/link";
import { Logo } from "./logo";
import { NavbarActions } from "./navbar-actions";
import { NavbarMobile } from "./navbar-mobile";

const navLinks = mainNavLinks;

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand/15 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Utility row */}
        <div className="relative flex h-14 items-center justify-between lg:h-16">
          <div className="flex items-center lg:w-40">
            <NavbarMobile />
          </div>

          {/* Spacer keeps search aligned right on mobile (no center logo) */}
          <div className="flex-1 lg:hidden" aria-hidden />

          <Link
            href="/"
            className="group absolute left-1/2 hidden -translate-x-1/2 items-center gap-2.5 transition-opacity hover:opacity-85 sm:gap-3 lg:flex"
          >
            <Logo
              className="block aspect-square h-[2.2rem] w-[2.2rem] shrink-0 sm:h-[2.4rem] sm:w-[2.4rem] lg:h-[2.7rem] lg:w-[2.7rem]"
              priority
              decorative
            />
            <span className="flex flex-col items-start text-left leading-none">
              <span className="font-display text-lg font-normal uppercase tracking-[0.32em] text-brand sm:text-xl lg:text-2xl">
                Yoghurt
              </span>
              <span className="mt-1 text-[9px] font-normal uppercase tracking-[0.42em] text-brand/70 sm:text-[10px]">
                Clothing Gallery
              </span>
            </span>
          </Link>

          <NavbarActions />
        </div>

        {/* Desktop navigation */}
        <nav
          className="hidden border-t border-brand/10 lg:block"
          aria-label="Main"
        >
          <ul className="flex items-center justify-center gap-12 py-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[11px] font-normal uppercase tracking-[0.28em] text-brand transition-opacity hover:opacity-60"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
