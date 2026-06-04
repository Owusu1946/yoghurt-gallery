"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

const DEFAULT_MIN = 1;
const DEFAULT_MAX = 99;

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function QuantitySelector({
  value,
  onChange,
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  className,
}: QuantitySelectorProps) {
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  function commitInput(raw: string) {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) {
      setInputValue(String(value));
      return;
    }
    const next = clamp(parsed, min, max);
    onChange(next);
    setInputValue(String(next));
  }

  return (
    <div className={className}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
        Quantity
      </p>
      <div className="mt-3 inline-flex items-stretch border border-brand/25">
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={value <= min}
          onClick={() => onChange(clamp(value - 1, min, max))}
          className="flex h-11 w-11 items-center justify-center text-brand transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Minus className="h-4 w-4" strokeWidth={1.25} />
        </button>
        <input
          type="text"
          inputMode="numeric"
          aria-label="Quantity"
          value={inputValue}
          onChange={(e) => {
            const next = e.target.value.replace(/\D/g, "");
            setInputValue(next);
          }}
          onBlur={() => commitInput(inputValue)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          className="h-11 w-14 border-x border-brand/25 bg-white text-center text-sm font-semibold text-brand outline-none"
        />
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={value >= max}
          onClick={() => onChange(clamp(value + 1, min, max))}
          className="flex h-11 w-11 items-center justify-center text-brand transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus className="h-4 w-4" strokeWidth={1.25} />
        </button>
      </div>
    </div>
  );
}
