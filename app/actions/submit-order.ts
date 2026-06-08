"use server";

import {
  buildOrderCustomer,
  generateOrderId,
  validateCheckoutForm,
  type CheckoutFormErrors,
  type CheckoutFormInput,
} from "@/lib/orders";

import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { CartLine } from "@/context/cart-context";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export type SubmitOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; errors: CheckoutFormErrors };

export async function submitOrder(
  form: CheckoutFormInput,
  items: CartLine[],
): Promise<SubmitOrderResult> {
  if (items.length < 1) {
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

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const dbUser = await db.select().from(users).where(eq(users.id, user.id));
    if (dbUser[0]?.isBanned) {
      return {
        ok: false,
        errors: { form: "Your account has been suspended. Please contact support." },
      };
    }
  }

  const orderId = generateOrderId();
  const subtotal = items.reduce(
    (sum, line) => sum + line.priceGhs * line.quantity,
    0,
  );

  try {
    await db.insert(orders).values({
      id: orderId,
      userId: user?.id ?? null,
      status: "confirmed",
      paymentMethod: "pod",
      paymentLabel: "Pay on Delivery",
      customer,
      lines: items,
      subtotal,
    });
    
    revalidateTag("admin-orders", {});
    
  } catch (error) {
    console.error("Failed to save order to DB:", error);
    return {
      ok: false,
      errors: { form: "Failed to save order to database. Please try again." },
    };
  }

  return { ok: true, orderId };
}
