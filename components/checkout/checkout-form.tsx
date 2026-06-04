"use client";

import { submitOrder } from "@/app/actions/submit-order";
import { DeliveryLocationFields } from "@/components/checkout/delivery-location-fields";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { GREATER_ACCRA_REGION_ID } from "@/data/ghana-regions";
import { setAuthReturnUrl } from "@/lib/auth-return";
import Link from "next/link";
import {
  clearCheckoutDraft,
  loadCheckoutDraft,
  mergeCheckoutWithUser,
  saveCheckoutDraft,
} from "@/lib/checkout-draft";
import {
  buildOrderCustomer,
  buildPlacedOrder,
  type CheckoutFormErrors,
  type CheckoutFormInput,
} from "@/lib/orders";
import { sanitizeOrderForStorage } from "@/lib/order-storage";
import {
  LAST_ORDER_STORAGE_KEY,
  PENDING_ORDER_REF_KEY,
  writeSessionStorage,
  writeStorage,
} from "@/lib/storage";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const fieldClass =
  "mt-2 w-full border border-brand/20 bg-white px-4 py-3 text-sm text-brand outline-none transition-colors placeholder:text-brand/35 focus:border-brand";

const labelClass =
  "text-[10px] font-semibold uppercase tracking-[0.28em] text-brand";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-700">{message}</p>;
}

const defaultForm: CheckoutFormInput = {
  fullName: "",
  phone: "",
  email: "",
  regionId: GREATER_ACCRA_REGION_ID,
  accraAreaId: "dansoman",
  townOrCity: "",
  address: "",
  landmark: "",
  notes: "",
};

export function CheckoutForm() {
  const router = useRouter();
  const { items } = useCart();
  const { user, isAuthenticated, hydrated: authReady } = useAuth();
  const [form, setForm] = useState<CheckoutFormInput>(defaultForm);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const formInitialized = useRef(false);

  useEffect(() => {
    if (!authReady || formInitialized.current) return;
    formInitialized.current = true;
    setForm(
      mergeCheckoutWithUser(loadCheckoutDraft(), user, defaultForm),
    );
  }, [authReady, user]);

  useEffect(() => {
    if (!authReady) return;
    const timer = window.setTimeout(() => saveCheckoutDraft(form), 400);
    return () => window.clearTimeout(timer);
  }, [form, authReady]);

  function updateField<K extends keyof CheckoutFormInput>(
    key: K,
    value: CheckoutFormInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function redirectToSignUp() {
    saveCheckoutDraft(form);
    setAuthReturnUrl("/checkout");
    router.push(
      `/account/sign-up?returnTo=${encodeURIComponent("/checkout")}`,
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || items.length === 0) return;

    if (!isAuthenticated) {
      redirectToSignUp();
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const result = await submitOrder(form, items.length);

      if (!result.ok) {
        setErrors(result.errors);
        return;
      }

      const customer = buildOrderCustomer(form);
      if (!customer) {
        setErrors({ form: "Please check your details and try again." });
        return;
      }

      const order = buildPlacedOrder(result.orderId, customer, [...items]);
      const storedOrder = sanitizeOrderForStorage(order);
      writeStorage(LAST_ORDER_STORAGE_KEY, storedOrder);
      writeSessionStorage(PENDING_ORDER_REF_KEY, result.orderId);
      clearCheckoutDraft();
      router.replace(
        `/checkout/confirmation?ref=${encodeURIComponent(result.orderId)}`,
      );
    } catch {
      setErrors({
        form: "Something went wrong. Please try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form id="checkout-form" onSubmit={handleSubmit} className="max-w-xl" noValidate>
      <h1 className="font-display text-3xl font-semibold text-brand">
        Checkout
      </h1>
      <p className="mt-2 text-sm font-medium text-brand/60">
        Delivery anywhere in Ghana. Pay when your order arrives.
      </p>

      {!isAuthenticated ? (
        <div className="mt-6 border border-brand/15 bg-brand/[0.03] px-4 py-4">
          <p className="text-sm leading-relaxed text-brand/70">
            Create a free account to place your order.{" "}
            <Link
              href={`/account/sign-up?returnTo=${encodeURIComponent("/checkout")}`}
              onClick={() => {
                saveCheckoutDraft(form);
                setAuthReturnUrl("/checkout");
              }}
              className="font-semibold text-brand underline-offset-2 hover:underline"
            >
              Create account
            </Link>{" "}
            or{" "}
            <Link
              href={`/account/sign-in?returnTo=${encodeURIComponent("/checkout")}`}
              onClick={() => {
                saveCheckoutDraft(form);
                setAuthReturnUrl("/checkout");
              }}
              className="font-semibold text-brand underline-offset-2 hover:underline"
            >
              sign in
            </Link>
            . Your details are saved as you type.
          </p>
        </div>
      ) : (
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-brand/50">
          Signed in as {user?.fullName}
        </p>
      )}

      {errors.form ? (
        <p
          className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          role="alert"
        >
          {errors.form}
        </p>
      ) : null}

      <div className="mt-10 space-y-8">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            className={fieldClass}
            placeholder="Your full name"
          />
          <FieldError message={errors.fullName} />
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={fieldClass}
              placeholder="e.g. 024 000 0000"
            />
            <FieldError message={errors.phone} />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={fieldClass}
              placeholder="you@email.com"
            />
            <FieldError message={errors.email} />
          </div>
        </div>

        <DeliveryLocationFields
          form={form}
          errors={errors}
          onFieldChange={updateField}
        />

        <div>
          <label htmlFor="notes" className={labelClass}>
            Order notes <span className="text-brand/40">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            className={cn(fieldClass, "resize-y")}
            placeholder="Preferred delivery time, gate code, etc."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || items.length === 0}
        className="mt-10 hidden w-full border border-brand bg-brand px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[16rem] lg:inline-block"
      >
        {submitting
          ? "Placing order…"
          : isAuthenticated
            ? "Place order"
            : "Create account to place order"}
      </button>

      <p className="mt-4 max-w-md text-xs leading-relaxed text-brand/50">
        By placing your order, you agree to pay the total shown on delivery.
        We will call you to confirm your order and delivery fee where applicable.
      </p>
    </form>
  );
}
