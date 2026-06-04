import { PageIntro } from "@/components/marketing/page-intro";
import { ValueProps } from "@/components/value-props";
import { aboutContent, companyInfo } from "@/data/company";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About · Yoghurt Clothing Gallery",
  description:
    "Learn about Yoghurt Clothing Gallery — fashion and printing from Dansoman, Greater Accra.",
};

export default function AboutPage() {
  return (
    <div className="page-shell flex flex-1 flex-col bg-white">
      <PageIntro
        eyebrow="About us"
        title={aboutContent.headline}
        description={aboutContent.intro}
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-16">
        {aboutContent.story.map((paragraph) => (
          <p
            key={paragraph.slice(0, 40)}
            className="mt-6 text-sm leading-relaxed text-brand/75 first:mt-0 sm:text-base"
          >
            {paragraph}
          </p>
        ))}

        <dl className="mt-12 grid gap-6 border border-brand/10 bg-brand/[0.02] p-6 sm:grid-cols-2">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand/45">
              Location
            </dt>
            <dd className="mt-2 text-sm font-medium text-brand">
              {companyInfo.location.area}
              <br />
              {companyInfo.location.region}, {companyInfo.location.country}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand/45">
              Established
            </dt>
            <dd className="mt-2 text-sm font-medium text-brand">
              {companyInfo.established}
            </dd>
          </div>
        </dl>

        <Link
          href="/contact"
          className="mt-10 inline-block text-xs font-semibold uppercase tracking-[0.22em] text-brand underline-offset-2 hover:underline"
        >
          Get in touch →
        </Link>
      </div>

      <ValueProps />
    </div>
  );
}
