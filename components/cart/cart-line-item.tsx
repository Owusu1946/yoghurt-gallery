import type { CartLine } from "@/context/cart-context";
import { normalizeCustomTeeDesign } from "@/lib/customizer-migrate";
import { sideHasPrint } from "@/data/customizer";
import { formatGhs } from "@/lib/format-ghs";
import { cn } from "@/lib/cn";
import { X } from "lucide-react";
import Image from "next/image";

type CartLineItemProps = {
  line: CartLine;
  onRemove?: (lineId: string) => void;
  compact?: boolean;
};

export function CartLineItem({
  line,
  onRemove,
  compact = false,
}: CartLineItemProps) {
  const isMockup = line.image.startsWith("/mockups");
  const isDataUrl = line.image.startsWith("data:");
  const lineTotal = line.priceGhs * line.quantity;

  const customLabel = line.customTee
    ? (() => {
        const design = normalizeCustomTeeDesign(line.customTee);
        const parts: string[] = [];
        if (sideHasPrint(design.front)) parts.push("Front print");
        if (sideHasPrint(design.back)) parts.push("Back print");
        return parts.join(" · ");
      })()
    : null;

  return (
    <li className={cn("flex gap-4", compact ? "py-4" : "py-5")}>
      <div
        className={cn(
          "relative shrink-0 bg-brand/[0.03]",
          compact ? "h-20 w-16" : "h-24 w-[4.5rem]",
        )}
      >
        {isDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={line.image}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <Image
            src={line.image}
            alt={line.name}
            fill
            className={cn(
              "object-center",
              isMockup ? "object-contain p-1" : "object-cover",
            )}
            sizes="72px"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              {line.name}
            </p>
            <p className="mt-1 text-sm text-brand/60">
              Size {line.size}
              {line.colorName ? ` · ${line.colorName}` : ""}
            </p>
            {customLabel ? (
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand/45">
                {customLabel}
              </p>
            ) : null}
          </div>
          {onRemove ? (
            <button
              type="button"
              onClick={() => onRemove(line.lineId)}
              className="flex h-8 w-8 shrink-0 items-center justify-center text-brand/45 transition-opacity hover:text-brand hover:opacity-100"
              aria-label={`Remove ${line.name} from bag`}
            >
              <X className="h-4 w-4" strokeWidth={1.25} />
            </button>
          ) : null}
        </div>
        <p className="mt-2 text-sm font-semibold text-brand">
          {formatGhs(lineTotal)}
          {line.quantity > 1 ? (
            <span className="ml-2 font-medium text-brand/50">
              ({formatGhs(line.priceGhs)} × {line.quantity})
            </span>
          ) : null}
        </p>
      </div>
    </li>
  );
}
