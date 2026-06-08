import { AUTH_USERS_KEY, readStorage, writeStorage } from "@/lib/storage";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
};

type StoredAuthUser = AuthUser & {
  passwordHash: string;
};

export type SignUpInput = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type SignInInput = {
  identifier: string;
  password: string;
};

export type AuthFormErrors = Partial<
  Record<keyof SignUpInput | keyof SignInInput | "form" | "otp", string>
>;

export type OtpChannel = "sms" | "email";

const USERS_REGISTRY_VERSION = 1;

type UsersRegistry = {
  version: number;
  byEmail: Record<string, StoredAuthUser>;
  byPhone: Record<string, string>;
};

function emptyRegistry(): UsersRegistry {
  return { version: USERS_REGISTRY_VERSION, byEmail: {}, byPhone: {} };
}

function readRegistry(): UsersRegistry {
  const raw = readStorage<UsersRegistry | null>(AUTH_USERS_KEY, null);
  if (!raw || raw.version !== USERS_REGISTRY_VERSION) {
    return emptyRegistry();
  }
  return raw;
}

function writeRegistry(registry: UsersRegistry): void {
  writeStorage(AUTH_USERS_KEY, registry);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, "").replace(/^\+233/, "0");
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function validateSignUp(input: SignUpInput): AuthFormErrors {
  const errors: AuthFormErrors = {};

  if (input.fullName.trim().length < 2) {
    errors.fullName = "Enter your full name.";
  }

  const email = normalizeEmail(input.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  const phone = normalizePhone(input.phone);
  if (!/^0?\d{9,10}$/.test(phone)) {
    errors.phone = "Enter a valid Ghana phone number.";
  }

  if (input.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (input.password !== input.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  const registry = readRegistry();
  if (email && registry.byEmail[email]) {
    errors.email = "An account with this email already exists.";
  }
  if (phone && registry.byPhone[phone]) {
    errors.phone = "An account with this phone number already exists.";
  }

  return errors;
}

export function validateSignIn(input: SignInInput): AuthFormErrors {
  const errors: AuthFormErrors = {};

  if (input.identifier.trim().length < 3) {
    errors.identifier = "Enter your email or phone number.";
  }

  if (input.password.length < 1) {
    errors.password = "Enter your password.";
  }

  return errors;
}

export function validateOtpCode(code: string): AuthFormErrors {
  const cleaned = code.replace(/\D/g, "");
  if (cleaned.length !== 8) {
    return { otp: "Enter the 8-digit verification code." };
  }
  return {};
}

/** UI-only OTP — any 8 digits accepted until SMS/email provider is wired */
export function isOtpValid(code: string): boolean {
  return code.replace(/\D/g, "").length === 8;
}

export async function createUser(input: SignUpInput): Promise<AuthUser> {
  const errors = validateSignUp(input);
  if (Object.keys(errors).length > 0) {
    throw new Error("Invalid sign-up data");
  }

  const registry = readRegistry();
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const passwordHash = await hashPassword(input.password);

  const user: StoredAuthUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    fullName: input.fullName.trim(),
    email,
    phone,
    createdAt: new Date().toISOString(),
    passwordHash,
  };

  registry.byEmail[email] = user;
  registry.byPhone[phone] = email;
  writeRegistry(registry);

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
  };
}
export async function authenticateUser(
  input: SignInInput,
): Promise<AuthUser | null> {
  const errors = validateSignIn(input);
  if (Object.keys(errors).length > 0) {
    return null;
  }

  const identifier = input.identifier.trim();
  const registry = readRegistry();
  const emailKey = identifier.includes("@")
    ? normalizeEmail(identifier)
    : registry.byPhone[normalizePhone(identifier)];
  const stored = emailKey ? registry.byEmail[emailKey] : undefined;

  if (!stored) {
    return null;
  }

  const passwordHash = await hashPassword(input.password);
  if (passwordHash !== stored.passwordHash) {
    return null;
  }

  return {
    id: stored.id,
    fullName: stored.fullName,
    email: stored.email,
    phone: stored.phone,
    createdAt: stored.createdAt,
  };
}

export function findUserById(userId: string): AuthUser | null {
  const registry = readRegistry();
  const stored = Object.values(registry.byEmail).find((u) => u.id === userId);
  if (!stored) return null;
  return {
    id: stored.id,
    fullName: stored.fullName,
    email: stored.email,
    phone: stored.phone,
    createdAt: stored.createdAt,
  };
}

export function sanitizeReturnPath(path: string | null): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }
  return path;
}
