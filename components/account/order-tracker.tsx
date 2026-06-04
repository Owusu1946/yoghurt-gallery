"use client";

import {
  deriveOrderStatus,
  getTrackingStepStates,
  orderTrackingSteps,
  type OrderStatus,
} from "@/data/order-status";
import { cn } from "@/lib/cn";
import { Check } from "lucide-react";

type OrderTrackerProps = {
  createdAt: string;
  status?: OrderStatus;
};

export function OrderTracker({ createdAt, status }: OrderTrackerProps) {
  const currentStatus = status ?? deriveOrderStatus(createdAt);
  const stepStates = getTrackingStepStates(currentStatus);

  return (
    <ol className="space-y-0">
      {orderTrackingSteps.map((step, index) => {
        const state = stepStates[index];
        const isLast = index === orderTrackingSteps.length - 1;

        return (
          <li key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast ? (
              <span
                className={cn(
                  "absolute left-[11px] top-6 h-[calc(100%-0.5rem)] w-px",
                  state === "complete" ? "bg-brand" : "bg-brand/15",
                )}
                aria-hidden
              />
            ) : null}

            <span
              className={cn(
                "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                state === "complete" && "border-brand bg-brand text-white",
                state === "current" &&
                  "border-brand bg-white text-brand ring-2 ring-brand/20",
                state === "upcoming" && "border-brand/20 bg-white text-brand/30",
              )}
            >
              {state === "complete" ? (
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : (
                <span className="h-2 w-2 rounded-full bg-current" />
              )}
            </span>

            <div className="min-w-0 pt-0.5">
              <p
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.16em]",
                  state === "upcoming" ? "text-brand/40" : "text-brand",
                )}
              >
                {step.label}
                {state === "current" ? (
                  <span className="ml-2 text-[10px] font-semibold text-brand/50">
                    · Now
                  </span>
                ) : null}
              </p>
              <p
                className={cn(
                  "mt-1 text-sm leading-relaxed",
                  state === "upcoming" ? "text-brand/40" : "text-brand/65",
                )}
              >
                {step.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
