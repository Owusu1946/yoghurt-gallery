import {
  CUSTOM_PRINT_FEE,
  CUSTOM_TEE_BASE_PRICE,
} from "@/data/customizer";
import { ADMIN_SETTINGS_KEY, readStorage, writeStorage } from "@/lib/storage";

export type AdminSettings = {
  customTeeBasePrice: number;
  customPrintFee: number;
};

const DEFAULT_SETTINGS: AdminSettings = {
  customTeeBasePrice: CUSTOM_TEE_BASE_PRICE,
  customPrintFee: CUSTOM_PRINT_FEE,
};

const SETTINGS_EVENT = "yoghurt-admin-settings";

export function getAdminSettings(): AdminSettings {
  const stored = readStorage<Partial<AdminSettings> | null>(ADMIN_SETTINGS_KEY, null);
  if (!stored) return { ...DEFAULT_SETTINGS };
  return {
    customTeeBasePrice: stored.customTeeBasePrice ?? DEFAULT_SETTINGS.customTeeBasePrice,
    customPrintFee: stored.customPrintFee ?? DEFAULT_SETTINGS.customPrintFee,
  };
}

export function saveAdminSettings(settings: AdminSettings): void {
  writeStorage(ADMIN_SETTINGS_KEY, settings);
  window.dispatchEvent(new CustomEvent(SETTINGS_EVENT));
}

export function subscribeAdminSettings(listener: () => void): () => void {
  const handler = () => listener();
  window.addEventListener(SETTINGS_EVENT, handler);
  return () => window.removeEventListener(SETTINGS_EVENT, handler);
}
