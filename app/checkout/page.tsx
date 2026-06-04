import { CheckoutPageClient } from "@/components/checkout/checkout-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout · Yoghurt Clothing Gallery",
  description: "Complete your order with pay on delivery.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
