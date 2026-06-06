"use client";

import {
  authenticateAdmin,
  getAdminSession,
  signOutAdmin,
  type AdminSession,
} from "@/lib/admin-auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AdminContextValue = {
  session: AdminSession | null;
  hydrated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(getAdminSession());
    setHydrated(true);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const next = await authenticateAdmin(email, password);
    if (!next) return false;
    setSession(next);
    return true;
  }, []);

  const signOut = useCallback(() => {
    signOutAdmin();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      hydrated,
      isAdmin: Boolean(session),
      signIn,
      signOut,
    }),
    [session, hydrated, signIn, signOut],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}
