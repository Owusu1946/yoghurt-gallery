"use client";

import { authFieldClass, authLabelClass } from "@/components/auth/form-styles";
import { cn } from "@/lib/cn";
import { useRef } from "react";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

export function OtpInput({ value, onChange, error, disabled }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(8, " ").slice(0, 8).split("");

  function updateDigit(index: number, char: string) {
    const digit = char.replace(/\D/g, "").slice(-1);
    const next = digits.map((d, i) => (i === index ? digit : d.trim())).join("");
    onChange(next.replace(/\s/g, "").slice(0, 8));

    if (digit && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 8);
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, 7);
    inputRefs.current[focusIndex]?.focus();
  }

  return (
    <div>
      <p className={authLabelClass}>Verification code</p>
      <div className="mt-3 flex gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            disabled={disabled}
            value={digit.trim()}
            onChange={(e) => updateDigit(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            aria-label={`Digit ${index + 1}`}
            className={cn(
              "h-12 w-10 border border-brand/20 text-center text-lg font-semibold text-brand outline-none transition-colors focus:border-brand sm:h-14 sm:w-12",
              error && "border-red-300",
            )}
          />
        ))}
      </div>
      {error ? (
        <p className="mt-2 text-xs font-medium text-red-700">{error}</p>
      ) : null}
    </div>
  );
}
