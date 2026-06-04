import { PageIntro } from "@/components/marketing/page-intro";
import { fashionContent } from "@/data/company";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fashion Brand · Yoghurt Clothing Gallery",
  description:
    "Graphic tees, plain essentials, jerseys, and polos from Yoghurt Clothing Gallery.",
};

export default function FashionPage() {
  return (
    <div className="page-shell flex flex-1 flex-col bg-white">
      <PageIntro
        eyebrow={fashionContent.eyebrow}
        title={fashionContent.headline}
        description={fashionContent.intro}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="relative mx-auto aspect-[5/4] max-w-md lg:max-w-lg">
          <Image
            src="/mockups/2.png"
            alt="Yoghurt fashion collection"
            fill
            className="object-contain object-center"
            sizes="(max-width: 768px) 90vw, 480px"
            priority
          />
        </div>

        <ul className="mx-auto mt-12 grid max-w-3xl gap-8 sm:gap-10">
          {fashionContent.highlights.map((item) => (
            <li
              key={item.title}
              className="border-t border-brand/10 pt-8 first:border-t-0 first:pt-0"
            >
              <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-brand/70">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.22em] text-brand transition-opacity hover:opacity-60"
              >
                {item.cta} →
              </Link>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-14 flex max-w-3xl flex-col gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex justify-center border border-brand bg-brand px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-white"
          >
            Shop all
          </Link>
          <Link
            href="/customize"
            className="inline-flex justify-center border border-brand/25 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-brand"
          >
            Customize a tee
          </Link>
        </div>
      </div>
    </div>
  );
}
