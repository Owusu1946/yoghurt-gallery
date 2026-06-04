export const orderTrackingSteps = [
  {
    id: "confirmed",
    label: "Order placed",
    description: "We received your order and will call to confirm.",
  },
  {
    id: "preparing",
    label: "Preparing",
    description: "Your items are being picked and prepared.",
  },
  {
    id: "out_for_delivery",
    label: "Out for delivery",
    description: "Your order is on the way to your address.",
  },
  {
    id: "delivered",
    label: "Delivered",
    description: "Order complete. Pay on delivery if not paid yet.",
  },
] as const;

export type OrderStatus = (typeof orderTrackingSteps)[number]["id"];

export const orderStatusLabels: Record<OrderStatus, string> = {
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

/** Simulated status from elapsed time (demo until backend is wired) */
export function deriveOrderStatus(createdAt: string, now = Date.now()): OrderStatus {
  const elapsedMs = now - new Date(createdAt).getTime();
  const minutes = elapsedMs / 60_000;

  if (minutes >= 30) return "delivered";
  if (minutes >= 15) return "out_for_delivery";
  if (minutes >= 5) return "preparing";
  return "confirmed";
}

export function getStatusIndex(status: OrderStatus): number {
  return orderTrackingSteps.findIndex((step) => step.id === status);
}

export type TrackingStepState = "complete" | "current" | "upcoming";

export function getTrackingStepStates(currentStatus: OrderStatus): TrackingStepState[] {
  const currentIndex = getStatusIndex(currentStatus);
  return orderTrackingSteps.map((_, index) => {
    if (index < currentIndex) return "complete";
    if (index === currentIndex) return "current";
    return "upcoming";
  });
}
