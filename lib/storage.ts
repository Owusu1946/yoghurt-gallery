export const CART_STORAGE_KEY = "yoghurt-cart";
export const WISHLIST_STORAGE_KEY = "yoghurt-wishlist";
export const LAST_ORDER_STORAGE_KEY = "yoghurt-last-order";
export const AUTH_SESSION_KEY = "yoghurt-auth-session";
export const AUTH_USERS_KEY = "yoghurt-auth-users";
export const CHECKOUT_DRAFT_KEY = "yoghurt-checkout-draft";
export const PENDING_ORDER_REF_KEY = "yoghurt-pending-order-ref";

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / private mode
  }
}

export function removeStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function readSessionStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeSessionStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function removeSessionStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}
