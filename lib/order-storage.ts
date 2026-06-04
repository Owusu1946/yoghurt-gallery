import type { CartLine } from "@/context/cart-context";
import type { PlacedOrder } from "@/lib/orders";

/** Strip heavy design blobs so localStorage can persist the order */
export function sanitizeOrderLines(lines: CartLine[]): CartLine[] {
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

export function sanitizeOrderForStorage(order: PlacedOrder): PlacedOrder {
  return {
    ...order,
    lines: sanitizeOrderLines(order.lines),
  };
}
