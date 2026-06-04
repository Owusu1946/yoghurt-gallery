"use client";

import { AuthFieldError } from "@/components/auth/auth-field-error";
import { authFieldClass, authLabelClass } from "@/components/auth/form-styles";
import { OtpInput } from "@/components/auth/otp-input";
import { useAuth } from "@/context/auth-context";
import {
  isOtpValid,
  normalizeEmail,
  normalizePhone,
  validateOtpCode,
  validateSignUp,
  type AuthFormErrors,
  type OtpChannel,
  type SignUpInput,
} from "@/lib/auth";
import {
  consumeAuthReturnUrl,
  getReturnToFromSearchParam,
  setAuthReturnUrl,
} from "@/lib/auth-return";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type SignUpStep = "details" | "verify" | "otp";

const initialSignUp: SignUpInput = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export function SignUpFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = getReturnToFromSearchParam(searchParams.get("returnTo"));
  const { signUp, isAuthenticated, hydrated } = useAuth();

  useEffect(() => {
    if (returnTo !== "/") {
      setAuthReturnUrl(returnTo);
    }
  }, [returnTo]);

  const [step, setStep] = useState<SignUpStep>("details");
  const [form, setForm] = useState<SignUpInput>(initialSignUp);
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [otpChannel, setOtpChannel] = useState<OtpChannel>("sms");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (hydrated && isAuthenticated) {
    router.replace(consumeAuthReturnUrl(returnTo));
    return null;
  }

  function updateField<K extends keyof SignUpInput>(
    key: K,
    value: SignUpInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function handleDetailsSubmit(event: React.FormEvent) {
    event.preventDefault();
    const validation = validateSignUp(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});
    setStep("verify");
  }

  function handleSendOtp() {
    setOtpSent(true);
    setStep("otp");
    setErrors({});
  }

  async function handleCompleteSignUp(event: React.FormEvent) {
    event.preventDefault();
    const otpErrors = validateOtpCode(otpCode);
    if (Object.keys(otpErrors).length > 0) {
      setErrors(otpErrors);
      return;
    }
    if (!isOtpValid(otpCode)) {
      setErrors({ otp: "Enter the 6-digit verification code." });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      await signUp(form);
      router.replace(consumeAuthReturnUrl(returnTo));
    } catch {
      setErrors({ form: "Could not create your account. Try again." });
    } finally {
      setSubmitting(false);
    }
  }

  const maskedPhone = normalizePhone(form.phone).replace(
    /(\d{3})\d{4}(\d{3})/,
    "$1••••$2",
  );
  const maskedEmail = (() => {
    const email = normalizeEmail(form.email);
    const [local, domain] = email.split("@");
    if (!domain) return email;
    const visible = local.slice(0, 2);
    return `${visible}•••@${domain}`;
  })();

  const signInHref =
    returnTo !== "/"
      ? `/account/sign-in?returnTo=${encodeURIComponent(returnTo)}`
      : "/account/sign-in";

  return (
    <div className="mx-auto max-w-md px-4 py-8 pb-24 sm:px-6 lg:py-16 lg:pb-16">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/50">
        Create account
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-brand">
        Join Yoghurt
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-brand/65">
        An account is required to place orders. Verify your phone or email to
        continue.
      </p>

      <div className="mt-8 flex gap-2">
        {(["details", "verify", "otp"] as SignUpStep[]).map((s, index) => (
          <div
            key={s}
            className={cn(
              "h-0.5 flex-1",
              step === s || index < ["details", "verify", "otp"].indexOf(step)
                ? "bg-brand"
                : "bg-brand/15",
            )}
            aria-hidden
          />
        ))}
      </div>

      {errors.form ? (
        <p
          className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          role="alert"
        >
          {errors.form}
        </p>
      ) : null}

      {step === "details" ? (
        <form onSubmit={handleDetailsSubmit} className="mt-10 space-y-6" noValidate>
          <div>
            <label htmlFor="fullName" className={authLabelClass}>
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              required
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className={authFieldClass}
            />
            <AuthFieldError message={errors.fullName} />
          </div>

          <div>
            <label htmlFor="email" className={authLabelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={authFieldClass}
            />
            <AuthFieldError message={errors.email} />
          </div>

          <div>
            <label htmlFor="phone" className={authLabelClass}>
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              required
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={authFieldClass}
              placeholder="0241234567"
            />
            <AuthFieldError message={errors.phone} />
          </div>

          <div>
            <label htmlFor="password" className={authLabelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              className={authFieldClass}
            />
            <AuthFieldError message={errors.password} />
          </div>

          <div>
            <label htmlFor="confirmPassword" className={authLabelClass}>
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              className={authFieldClass}
            />
            <AuthFieldError message={errors.confirmPassword} />
          </div>

          <button
            type="submit"
            className="w-full border border-brand bg-brand px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90"
          >
            Continue
          </button>
        </form>
      ) : null}

      {step === "verify" ? (
        <div className="mt-10 space-y-8">
          <div>
            <p className={authLabelClass}>Verify with</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setOtpChannel("sms")}
                className={cn(
                  "border px-4 py-4 text-left transition-colors",
                  otpChannel === "sms"
                    ? "border-brand bg-brand/[0.04]"
                    : "border-brand/20 hover:border-brand/40",
                )}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  SMS
                </span>
                <p className="mt-1 text-sm text-brand/65">{maskedPhone}</p>
              </button>
              <button
                type="button"
                onClick={() => setOtpChannel("email")}
                className={cn(
                  "border px-4 py-4 text-left transition-colors",
                  otpChannel === "email"
                    ? "border-brand bg-brand/[0.04]"
                    : "border-brand/20 hover:border-brand/40",
                )}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  Email
                </span>
                <p className="mt-1 text-sm text-brand/65">{maskedEmail}</p>
              </button>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-brand/50">
            We will send a 6-digit code to your {otpChannel === "sms" ? "phone" : "email"}.
            OTP delivery is simulated for now — any 6-digit code works on the next step.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep("details")}
              className="border border-brand/25 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSendOtp}
              className="flex-1 border border-brand bg-brand px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90"
            >
              Send code
            </button>
          </div>
        </div>
      ) : null}

      {step === "otp" ? (
        <form onSubmit={handleCompleteSignUp} className="mt-10 space-y-8" noValidate>
          <p className="text-sm text-brand/65">
            Enter the code sent to{" "}
            <span className="font-semibold text-brand">
              {otpChannel === "sms" ? maskedPhone : maskedEmail}
            </span>
            {otpSent ? "" : "."}
          </p>

          <OtpInput
            value={otpCode}
            onChange={setOtpCode}
            error={errors.otp}
            disabled={submitting}
          />

          <p className="rounded-sm border border-brand/10 bg-brand/[0.03] px-4 py-3 text-xs leading-relaxed text-brand/55">
            Demo: SMS/email OTP is not connected yet. Enter any 6 digits to
            finish creating your account.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep("verify")}
              className="border border-brand/25 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 border border-brand bg-brand px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleSendOtp}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/50 transition-opacity hover:text-brand"
          >
            Resend code
          </button>
        </form>
      ) : null}

      <p className="mt-10 text-center text-sm text-brand/60">
        Already have an account?{" "}
        <Link
          href={signInHref}
          className="font-semibold text-brand underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
