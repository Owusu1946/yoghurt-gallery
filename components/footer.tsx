import { companyLinks, mainNavLinks, shopLinks } from "@/data/navigation";
import Link from "next/link";
import { Logo } from "./logo";

const currentYear = new Date().getFullYear();

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm font-medium text-brand/70 transition-opacity hover:text-brand hover:opacity-100"
      >
        {label}
      </Link>
    </li>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-brand/10 bg-white text-brand">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col items-center text-center lg:col-span-4 lg:items-start lg:text-left">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Logo className="h-24 w-24 sm:h-28 sm:w-28" />
            </Link>
            <p className="mt-6 max-w-xs text-sm font-medium leading-relaxed text-brand/70">
              Creativity, quality, and reliability — graphic tees, tops, and
              professional printing from Dansoman, Greater Accra.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
            <FooterColumn title="Shop">
              {shopLinks.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
              <li>
                <Link
                  href="/shop"
                  className="text-sm font-semibold text-brand transition-opacity hover:opacity-60"
                >
                  View all
                </Link>
              </li>
            </FooterColumn>

            <FooterColumn title="Company">
              {companyLinks.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </FooterColumn>

            <FooterColumn title="Visit">
              <li className="text-sm font-medium leading-relaxed text-brand/70">
                Dansoman
                <br />
                Greater Accra, Ghana
              </li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="text-sm font-semibold text-brand transition-opacity hover:opacity-60"
                >
                  Contact us
                </Link>
              </li>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-brand/10 pt-8 sm:flex-row">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand/50">
            © {currentYear} Yoghurt Clothing Gallery · Est. 2026
          </p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-6">
              {mainNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/50 transition-opacity hover:text-brand hover:opacity-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
