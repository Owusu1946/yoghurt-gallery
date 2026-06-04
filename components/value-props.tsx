import { valueProps } from "@/data/value-props";
import { navIconProps } from "./nav-icon";

export function ValueProps() {
  return (
    <section className="border-b border-brand/10 bg-brand/[0.03]">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
        <header className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            Why Yoghurt
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-brand sm:text-4xl">
            Built on trust
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm font-medium leading-relaxed text-brand">
            We don&apos;t just make clothing — we create lasting impressions.
          </p>
        </header>

        <ul className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-0 lg:mt-16">
          {valueProps.map((item, index) => {
            const Icon = item.icon;

            return (
              <li
                key={item.id}
                className={`flex flex-col items-center px-4 text-center sm:px-6 ${
                  index > 0 ? "sm:border-l sm:border-brand/10" : ""
                }`}
              >
                <Icon {...navIconProps} className="text-brand" strokeWidth={1.25} />
                <h3 className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm font-medium leading-relaxed text-brand">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
