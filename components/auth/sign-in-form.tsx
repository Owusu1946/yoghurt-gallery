"use client";

import { AuthFieldError } from "@/components/auth/auth-field-error";
import { authFieldClass, authLabelClass } from "@/components/auth/form-styles";
import { useAuth } from "@/context/auth-context";
import {
  validateSignIn,
  type AuthFormErrors,
  type SignInInput,
} from "@/lib/auth";
import {
  consumeAuthReturnUrl,
  getReturnToFromSearchParam,
  setAuthReturnUrl,
} from "@/lib/auth-return";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const initialSignIn: SignInInput = {
  identifier: "",
  password: "",
};

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = getReturnToFromSearchParam(searchParams.get("returnTo"));
  const { signIn, isAuthenticated, hydrated } = useAuth();

  useEffect(() => {
    if (returnTo !== "/") {
      setAuthReturnUrl(returnTo);
    }
  }, [returnTo]);

  const [form, setForm] = useState<SignInInput>(initialSignIn);
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  if (hydrated && isAuthenticated) {
    router.replace(consumeAuthReturnUrl(returnTo));
    return null;
  }

  function updateField<K extends keyof SignInInput>(
    key: K,
    value: SignInInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const validation = validateSignIn(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setSubmitting(true);
    setErrors({});

    const user = await signIn(form);
    if (!user) {
      setErrors({
        form: "Incorrect email/phone or password. Try again or create an account.",
      });
      setSubmitting(false);
      return;
    }

    router.replace(consumeAuthReturnUrl(returnTo));
  }

  const signUpHref =
    returnTo !== "/"
      ? `/account/sign-up?returnTo=${encodeURIComponent(returnTo)}`
      : "/account/sign-up";

  return (
    <div className="mx-auto max-w-md px-4 py-8 pb-24 sm:px-6 lg:py-16 lg:pb-16">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/50">
        Welcome back
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-brand">
        Sign in
      </h1>

      {errors.form ? (
        <p
          className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          role="alert"
        >
          {errors.form}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-10 space-y-6" noValidate>
        <div>
          <label htmlFor="identifier" className={authLabelClass}>
            Email or phone
          </label>
          <input
            id="identifier"
            type="text"
            autoComplete="username"
            required
            value={form.identifier}
            onChange={(e) => updateField("identifier", e.target.value)}
            className={authFieldClass}
            placeholder="you@email.com or 0241234567"
          />
          <AuthFieldError message={errors.identifier} />
        </div>

        <div>
          <label htmlFor="password" className={authLabelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            className={authFieldClass}
          />
          <AuthFieldError message={errors.password} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full border border-brand bg-brand px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-10 text-center text-sm text-brand/60">
        New here?{" "}
        <Link
          href={signUpHref}
          className="font-semibold text-brand underline-offset-2 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
