"use client";

import {
  authenticateUser,
  createUser,
  findUserById,
  type AuthUser,
  type SignInInput,
  type SignUpInput,
} from "@/lib/auth";
import { authenticateAdmin, ADMIN_EMAIL } from "@/lib/admin-auth";
import { AUTH_SESSION_KEY, readStorage, writeStorage } from "@/lib/storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthSession = {
  userId: string;
  signedInAt: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  signUp: (input: SignUpInput) => Promise<AuthUser>;
  signIn: (input: SignInInput) => Promise<AuthUser | null>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function persistSession(userId: string) {
  const session: AuthSession = {
    userId,
    signedInAt: new Date().toISOString(),
  };
  writeStorage(AUTH_SESSION_KEY, session);
}

function clearSession() {
  writeStorage(AUTH_SESSION_KEY, null);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const session = readStorage<AuthSession | null>(AUTH_SESSION_KEY, null);
    if (session?.userId) {
      const storedUser = findUserById(session.userId);
      setUser(storedUser);
    }
    setHydrated(true);
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    const created = await createUser(input);
    persistSession(created.id);
    setUser(created);
    return created;
  }, []);

  const signIn = useCallback(async (input: SignInInput) => {
    const authenticated = await authenticateUser(input);
    if (!authenticated) {
      return null;
    }
    if (authenticated.email === ADMIN_EMAIL) {
      await authenticateAdmin(authenticated.email, input.password);
    }
    persistSession(authenticated.id);
    setUser(authenticated);
    return authenticated;
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      hydrated,
      signUp,
      signIn,
      signOut,
    }),
    [user, hydrated, signUp, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
