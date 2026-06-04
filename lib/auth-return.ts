import { sanitizeReturnPath } from "@/lib/auth";
import {
  readSessionStorage,
  removeSessionStorage,
  writeSessionStorage,
} from "@/lib/storage";

export const AUTH_RETURN_URL_KEY = "yoghurt-auth-return";

export function setAuthReturnUrl(path: string): void {
  writeSessionStorage(AUTH_RETURN_URL_KEY, sanitizeReturnPath(path));
}

export function consumeAuthReturnUrl(fallback = "/"): string {
  const path = readSessionStorage<string | null>(AUTH_RETURN_URL_KEY, null);
  removeSessionStorage(AUTH_RETURN_URL_KEY);
  return sanitizeReturnPath(path ?? fallback);
}

export function getReturnToFromSearchParam(
  searchParam: string | null,
): string {
  if (!searchParam) return "/";
  try {
    return sanitizeReturnPath(decodeURIComponent(searchParam));
  } catch {
    return "/";
  }
}
