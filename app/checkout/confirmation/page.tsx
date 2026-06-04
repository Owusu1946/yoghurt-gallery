import { OrderConfirmation } from "@/components/checkout/order-confirmation";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Order confirmed · Yoghurt Clothing Gallery",
  description: "Your Yoghurt Clothing Gallery order has been placed.",
};

export default function CheckoutConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmation />
    </Suspense>
  );
}
