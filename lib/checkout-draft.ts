import type { CheckoutFormInput } from "@/lib/orders";
import { CHECKOUT_DRAFT_KEY, readStorage, removeStorage, writeStorage } from "@/lib/storage";

export function saveCheckoutDraft(form: CheckoutFormInput): void {
  writeStorage(CHECKOUT_DRAFT_KEY, {
    form,
    savedAt: new Date().toISOString(),
  });
}

export function loadCheckoutDraft(): CheckoutFormInput | null {
  const stored = readStorage<{ form: CheckoutFormInput } | null>(
    CHECKOUT_DRAFT_KEY,
    null,
  );
  return stored?.form ?? null;
}

export function clearCheckoutDraft(): void {
  removeStorage(CHECKOUT_DRAFT_KEY);
}

export function mergeCheckoutWithUser(
  draft: CheckoutFormInput | null,
  user: { fullName: string; email: string; phone: string } | null,
  defaults: CheckoutFormInput,
): CheckoutFormInput {
  if (draft) {
    return draft;
  }

  if (!user) {
    return defaults;
  }

  return {
    ...defaults,
    fullName: defaults.fullName || user.fullName,
    email: defaults.email || user.email,
    phone: defaults.phone || user.phone,
  };
}
