export const paymentOnDelivery = {
  id: "cod",
  label: "Pay on delivery",
  description:
    "Pay when your order arrives — cash or Mobile Money. No online payment required.",
} as const;

export const checkoutSteps = [
  { id: "bag", label: "Bag", href: "/cart" },
  { id: "checkout", label: "Checkout", href: "/checkout" },
  { id: "confirmation", label: "Confirmation", href: "/checkout/confirmation" },
] as const;
