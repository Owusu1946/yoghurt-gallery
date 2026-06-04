import type { CartLine } from "@/context/cart-context";
import { findAccraArea } from "@/data/accra-areas";
import { paymentOnDelivery } from "@/data/checkout";
import {
  ghanaRegions,
  GREATER_ACCRA_REGION_ID,
  type GhanaRegionId,
} from "@/data/ghana-regions";

export type OrderCustomer = {
  fullName: string;
  phone: string;
  email: string;
  regionId: GhanaRegionId;
  regionLabel: string;
  accraAreaId: string | null;
  accraAreaLabel: string | null;
  townOrCity: string | null;
  address: string;
  landmark: string;
  notes: string;
  /** Single-line summary for receipts and confirmation */
  deliverySummary: string;
};

export type PlacedOrder = {
  id: string;
  createdAt: string;
  paymentMethod: typeof paymentOnDelivery.id;
  paymentLabel: string;
  customer: OrderCustomer;
  lines: CartLine[];
  subtotal: number;
};

export type CheckoutFormInput = {
  fullName: string;
  phone: string;
  email: string;
  regionId: string;
  accraAreaId: string;
  townOrCity: string;
  address: string;
  landmark: string;
  notes: string;
};

export type CheckoutFormErrors = Partial<
  Record<keyof CheckoutFormInput | "form", string>
>;

const regionIds = new Set(ghanaRegions.map((r) => r.id));

export function generateOrderId(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `YG-${y}${m}${d}-${rand}`;
}

function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, "").replace(/^\+233/, "0");
}

export function isGreaterAccraRegion(regionId: string): boolean {
  return regionId === GREATER_ACCRA_REGION_ID;
}

export function buildDeliverySummary(input: {
  regionLabel: string;
  accraAreaLabel: string | null;
  townOrCity: string | null;
  address: string;
  landmark: string;
}): string {
  const locality =
    input.accraAreaLabel ?? input.townOrCity ?? input.regionLabel;
  return `${locality}, ${input.regionLabel}`;
}

export function validateCheckoutForm(
  input: CheckoutFormInput,
): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};

  const fullName = input.fullName.trim();
  if (fullName.length < 2) {
    errors.fullName = "Enter your full name.";
  }

  const phone = normalizePhone(input.phone.trim());
  if (!/^0?\d{9,10}$/.test(phone)) {
    errors.phone = "Enter a valid Ghana phone number.";
  }

  const email = input.email.trim();
  if (email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email or leave blank.";
  }

  if (!regionIds.has(input.regionId as GhanaRegionId)) {
    errors.regionId = "Select your region.";
  } else if (isGreaterAccraRegion(input.regionId)) {
    if (!findAccraArea(input.accraAreaId)) {
      errors.accraAreaId = "Select your area in Accra.";
    }
  } else if (input.townOrCity.trim().length < 2) {
    errors.townOrCity = "Enter your city or town.";
  }

  if (input.address.trim().length < 3) {
    errors.address = "Enter your house number and street name.";
  }

  if (input.landmark.trim().length < 3) {
    errors.landmark = "Enter the closest landmark to your home.";
  }

  return errors;
}

export function buildOrderCustomer(
  input: CheckoutFormInput,
): OrderCustomer | null {
  const errors = validateCheckoutForm(input);
  if (Object.keys(errors).length > 0) {
    return null;
  }

  const region = ghanaRegions.find((r) => r.id === input.regionId);
  const inAccra = isGreaterAccraRegion(input.regionId);
  const accraArea = inAccra ? findAccraArea(input.accraAreaId) : null;

  const regionLabel = region?.label ?? input.regionId;
  const accraAreaLabel = accraArea?.label ?? null;
  const townOrCity = inAccra ? null : input.townOrCity.trim();

  const address = input.address.trim();
  const landmark = input.landmark.trim();

  return {
    fullName: input.fullName.trim(),
    phone: normalizePhone(input.phone.trim()),
    email: input.email.trim(),
    regionId: input.regionId as GhanaRegionId,
    regionLabel,
    accraAreaId: inAccra ? input.accraAreaId : null,
    accraAreaLabel,
    townOrCity,
    address,
    landmark,
    notes: input.notes.trim(),
    deliverySummary: buildDeliverySummary({
      regionLabel,
      accraAreaLabel,
      townOrCity,
      address,
      landmark,
    }),
  };
}

/** Legacy orders stored before location fields were expanded */
export type LegacyOrderCustomer = OrderCustomer & {
  deliveryArea?: string;
  deliveryAreaLabel?: string;
};

export function formatCustomerDelivery(
  customer: LegacyOrderCustomer,
): {
  summary: string;
  addressLines: string[];
} {
  if (customer.landmark && customer.deliverySummary) {
    return {
      summary: customer.deliverySummary,
      addressLines: [customer.address],
    };
  }

  const legacyLabel =
    customer.deliveryAreaLabel ?? customer.deliveryArea ?? "Ghana";
  return {
    summary: legacyLabel,
    addressLines: [customer.address, legacyLabel],
  };
}

export function buildPlacedOrder(
  orderId: string,
  customer: OrderCustomer,
  lines: CartLine[],
): PlacedOrder {
  const subtotal = lines.reduce(
    (sum, line) => sum + line.priceGhs * line.quantity,
    0,
  );

  return {
    id: orderId,
    createdAt: new Date().toISOString(),
    paymentMethod: paymentOnDelivery.id,
    paymentLabel: paymentOnDelivery.label,
    customer,
    lines,
    subtotal,
  };
}
