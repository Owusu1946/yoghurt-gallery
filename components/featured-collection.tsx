import { collections } from "@/data/collections";
import { formatGhs } from "@/lib/format-ghs";
import Image from "next/image";
import Link from "next/link";

export function FeaturedCollection() {
  return (
    <section className="border-b border-brand/10 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
        <header className="flex flex-col items-center text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
              Collection
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-brand sm:text-4xl">
              Shop the range
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-brand transition-opacity hover:opacity-60 lg:mt-0"
          >
            View all
          </Link>
        </header>

        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-14 lg:mt-16 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
          {collections.map((item) => (
            <li key={item.slug}>
              <Link href={item.href} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-brand/[0.03]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 1024px) 45vw, 22vw"
                    className="object-contain object-center p-4 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-5 border-t border-brand/10 pt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-brand">
                    From {formatGhs(item.priceGhs)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
