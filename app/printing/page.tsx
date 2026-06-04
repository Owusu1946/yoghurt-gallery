import { PageIntro } from "@/components/marketing/page-intro";
import { printingContent } from "@/data/company";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Printing Services · Yoghurt Clothing Gallery",
  description:
    "Custom tee printing and bulk orders for brands, churches, schools, and events in Ghana.",
};

export default function PrintingPage() {
  return (
    <div className="page-shell flex flex-1 flex-col bg-white">
      <PageIntro
        eyebrow={printingContent.eyebrow}
        title={printingContent.headline}
        description={printingContent.intro}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[5/4] w-full max-w-lg lg:max-w-none">
            <Image
              src="/mockups/4.png"
              alt="Printing services"
              fill
              className="object-contain object-center"
              sizes="(max-width: 1024px) 90vw, 50vw"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
              What we print
            </h2>
            <ul className="mt-5 space-y-3">
              {printingContent.services.map((service) => (
                <li
                  key={service}
                  className="flex gap-3 text-sm font-medium text-brand/75"
                >
                  <span className="text-brand/35" aria-hidden>
                    —
                  </span>
                  {service}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
              How it works
            </h2>
            <ol className="mt-5 list-decimal space-y-3 pl-4 text-sm leading-relaxed text-brand/70">
              {printingContent.process.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mx-auto mt-14 flex max-w-3xl flex-col gap-3 border-t border-brand/10 pt-10 sm:flex-row">
          <Link
            href="/customize"
            className="inline-flex justify-center border border-brand bg-brand px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-white"
          >
            Start custom tee
          </Link>
          <Link
            href="/contact"
            className="inline-flex justify-center border border-brand/25 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-brand"
          >
            Request a quote
          </Link>
        </div>
      </div>
    </div>
  );
}
