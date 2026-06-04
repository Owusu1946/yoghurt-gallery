import { pillars } from "@/data/pillars";
import Image from "next/image";
import Link from "next/link";

export function ServicePillars() {
  return (
    <section className="border-b border-brand/10 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
        <header className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            What we do
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-brand sm:text-4xl">
            Two ways we serve you
          </h2>
        </header>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-brand/10">
          {pillars.map((pillar) => (
            <article
              key={pillar.id}
              className="flex flex-col items-center text-center lg:px-10 xl:px-14"
            >
              <div className="relative aspect-[5/4] w-full max-w-sm">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-contain object-center"
                />
              </div>

              <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                {pillar.title}
              </h3>

              <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-brand sm:text-[0.9375rem]">
                {pillar.description}
              </p>

              <Link
                href={pillar.href}
                className="mt-8 inline-flex items-center justify-center border border-brand px-8 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand transition-opacity hover:opacity-60"
              >
                {pillar.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
