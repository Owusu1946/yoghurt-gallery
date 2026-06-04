"use server";

import {
  buildOrderCustomer,
  generateOrderId,
  validateCheckoutForm,
  type CheckoutFormErrors,
  type CheckoutFormInput,
} from "@/lib/orders";

export type SubmitOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; errors: CheckoutFormErrors };

export async function submitOrder(
  form: CheckoutFormInput,
  lineCount: number,
): Promise<SubmitOrderResult> {
  if (lineCount < 1) {
    return { ok: false, errors: { form: "Your bag is empty." } };
  }

  const errors = validateCheckoutForm(form);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const customer = buildOrderCustomer(form);
  if (!customer) {
    return {
      ok: false,
      errors: { form: "Please check your details and try again." },
    };
  }

  return { ok: true, orderId: generateOrderId() };
}
