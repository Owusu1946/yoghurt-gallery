import Link from "next/link";
import { HeroBackgroundShapes } from "./hero-background-shapes";
import { HeroMockupShowcase } from "./hero-mockup-showcase";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-brand/10 bg-white">
      <HeroBackgroundShapes />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-4 sm:px-6 sm:pt-6 lg:grid-cols-2 lg:items-center lg:gap-6 lg:pb-14 lg:pt-8">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            Dansoman · Greater Accra
          </p>

          <h1 className="mt-4 font-display text-[2.75rem] font-semibold leading-[1.1] text-brand sm:text-6xl lg:text-[3.75rem]">
            Clothing that
            <br />
            stands out
          </h1>

          <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-brand sm:text-[1.0625rem]">
            Stylish graphic tees and professional printing for individuals,
            brands, and institutions crafted with quality you can count on.
          </p>

          <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:gap-8 lg:items-start">
            <Link
              href="/shop"
              className="inline-flex min-w-[200px] items-center justify-center border border-brand px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-brand transition-opacity hover:opacity-60"
            >
              Shop collection
            </Link>
            <Link
              href="/printing"
              className="text-xs font-semibold uppercase tracking-[0.24em] text-brand transition-opacity hover:opacity-60"
            >
              Printing services
            </Link>
          </div>
        </div>

        <HeroMockupShowcase />
      </div>
    </section>
  );
}
