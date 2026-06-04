import type { StoredOrder } from "@/lib/orders";
import type { PlacedOrder } from "@/lib/orders";

/** Strip heavy design blobs so localStorage can persist the order */
export function sanitizeOrderLines(lines: PlacedOrder["lines"]) {
  return lines.map((line) => {
    if (!line.customTee) return line;
    return {
      ...line,
      customTee: {
        ...line.customTee,
        frontImage: null,
        backImage: null,
      },
    };
  });
}

export function sanitizeOrderForStorage<T extends PlacedOrder>(order: T): T {
  return {
    ...order,
    lines: sanitizeOrderLines(order.lines),
  };
}

export function toStoredOrder(order: PlacedOrder, userId: string): StoredOrder {
  return sanitizeOrderForStorage({ ...order, userId });
}
