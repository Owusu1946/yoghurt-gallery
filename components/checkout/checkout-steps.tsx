import { checkoutSteps } from "@/data/checkout";
import { cn } from "@/lib/cn";
import Link from "next/link";

type CheckoutStepsProps = {
  current: "bag" | "checkout" | "confirmation";
};

export function CheckoutSteps({ current }: CheckoutStepsProps) {
  const currentIndex = checkoutSteps.findIndex((step) => step.id === current);

  return (
    <nav aria-label="Checkout progress" className="mb-6 lg:mb-10">
      <ol className="flex items-center justify-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] sm:gap-2 sm:text-[10px] sm:tracking-[0.22em]">
        {checkoutSteps.map((step, index) => {
          const isPast = index < currentIndex;
          const isCurrent = step.id === current;
          const isClickable = isPast && step.id !== "confirmation";

          return (
            <li key={step.id} className="flex items-center gap-2">
              {index > 0 ? (
                <span className="text-brand/25" aria-hidden>
                  /
                </span>
              ) : null}
              {isClickable ? (
                <Link
                  href={step.href}
                  className="text-brand/50 transition-opacity hover:text-brand"
                >
                  {step.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    isCurrent ? "text-brand" : "text-brand/35",
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {step.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
