import {
  CUSTOM_PRINT_FEE,
  CUSTOM_TEE_BASE_PRICE,
  sideHasPrint,
  type CustomTeeDesign,
} from "@/data/customizer";
import { getAdminSettings } from "@/lib/admin-settings";

export function getCustomizerPricing() {
  if (typeof window === "undefined") {
    return {
      customTeeBasePrice: CUSTOM_TEE_BASE_PRICE,
      customPrintFee: CUSTOM_PRINT_FEE,
    };
  }
  return getAdminSettings();
}

export function calculateCustomizerPrice(design: CustomTeeDesign): number {
  const { customTeeBasePrice, customPrintFee } = getCustomizerPricing();
  let price = customTeeBasePrice;
  if (sideHasPrint(design.front)) price += customPrintFee;
  if (sideHasPrint(design.back)) price += customPrintFee;
  return price;
}
