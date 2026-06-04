import { ContactForm } from "@/components/contact/contact-form";
import { PageIntro } from "@/components/marketing/page-intro";
import { companyInfo } from "@/data/company";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact · Yoghurt Clothing Gallery",
  description: "Contact Yoghurt Clothing Gallery in Dansoman, Greater Accra.",
};

export default function ContactPage() {
  const { contact, location, hours } = companyInfo;
  const whatsappUrl = `https://wa.me/${contact.whatsapp}`;

  return (
    <div className="page-shell flex flex-1 flex-col bg-white">
      <PageIntro
        eyebrow="Contact"
        title="Let's talk"
        description="Questions about an order, custom print, or bulk quote? Reach out — we are happy to help."
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-16">
        <div>
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
            Visit & call
          </h2>
          <dl className="mt-6 space-y-6">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/45">
                Address
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-brand/75">
                {location.area}
                <br />
                {location.region}, {location.country}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/45">
                Phone
              </dt>
              <dd className="mt-2">
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="text-sm font-semibold text-brand hover:opacity-70"
                >
                  {contact.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/45">
                Email
              </dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm font-semibold text-brand hover:opacity-70"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/45">
                Hours
              </dt>
              <dd className="mt-2 text-sm text-brand/75">{hours}</dd>
            </div>
          </dl>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex border border-brand px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand transition-opacity hover:opacity-70"
          >
            WhatsApp us
          </a>

          <p className="mt-8 text-sm text-brand/55">
            Ordering online?{" "}
            <Link href="/shop" className="font-semibold text-brand hover:underline">
              Shop the collection
            </Link>{" "}
            or{" "}
            <Link
              href="/customize"
              className="font-semibold text-brand hover:underline"
            >
              customize a tee
            </Link>
            .
          </p>
        </div>

        <div>
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
            Send a message
          </h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
