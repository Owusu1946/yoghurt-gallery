import type { StoredOrder } from "@/lib/orders";
import type { PlacedOrder } from "@/lib/orders";
import { normalizeCustomTeeDesign } from "@/lib/customizer-migrate";

/** Strip heavy design blobs so localStorage can persist the order */
export function sanitizeOrderLines(lines: PlacedOrder["lines"]) {
  return lines.map((line) => {
    if (!line.customTee) return line;
    const design = normalizeCustomTeeDesign(line.customTee);
    return {
      ...line,
      customTee: {
        ...design,
        front: { ...design.front, image: null },
        back: { ...design.back, image: null },
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
