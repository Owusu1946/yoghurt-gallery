"use client";

import { createClient } from "@/lib/supabase/client";
import { type AuthUser, type SignInInput, type SignUpInput } from "@/lib/auth";
import { syncUserToDb } from "@/app/actions/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  signUp: (input: SignUpInput) => Promise<AuthUser>;
  signIn: (input: SignInInput) => Promise<AuthUser | null>;
  signOut: () => void;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapSupabaseUser(user: any): AuthUser {
  return {
    id: user.id,
    email: user.email!,
    phone: user.user_metadata?.phone || "",
    fullName: user.user_metadata?.fullName || "",
    createdAt: user.created_at,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const mappedUser = mapSupabaseUser(session.user);
        setUser(mappedUser);
        syncUserToDb(mappedUser); // Ensure they are in the DB!
      }
      setHydrated(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const mappedUser = mapSupabaseUser(session.user);
        setUser(mappedUser);
        syncUserToDb(mappedUser);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    console.log("--> Starting signUp flow in auth-context.tsx", { email: input.email });
    
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          fullName: input.fullName,
          phone: input.phone,
        },
      },
    });

    console.log("--> Supabase signUp response:", { data, error });

    if (error) {
      console.error("--> Supabase signUp error details:", error);
      throw error;
    }
    
    console.log("--> signUp successful, waiting for OTP verification.");

    // We return a dummy user since they aren't fully signed in until OTP is verified
    // (If auto-confirm is off, session is null here)
    return {
      id: data.user?.id || "",
      email: input.email,
      phone: input.phone,
      fullName: input.fullName,
      createdAt: new Date().toISOString(),
    };
  }, []);

  const signIn = useCallback(async (input: SignInInput) => {
    const isEmail = input.identifier.includes("@");
    const credentials = isEmail
      ? { email: input.identifier, password: input.password }
      : { phone: input.identifier, password: input.password };

    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error || !data.session) return null;
    const signedInUser = mapSupabaseUser(data.session.user);
    
    // Also sync on sign in to ensure existing users get saved to DB if they aren't already
    await syncUserToDb(signedInUser);
    
    return signedInUser;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const sendOtp = useCallback(async (email: string) => {
    // Supabase automatically sends OTP during signUp if auto-confirm is disabled.
    // If we need to resend, we can use resend()
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    if (error) throw error;
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string) => {
    console.log("--> Starting verifyOtp flow", { email, token });
    
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    console.log("--> Supabase verifyOtp response:", { session: !!data.session, error });

    if (error || !data.session) {
      console.error("--> Supabase verifyOtp error:", error);
      throw new Error(error?.message || "Invalid OTP");
    }
    
    console.log("--> OTP verified successfully!");
    const verifiedUser = mapSupabaseUser(data.session.user);
    
    // Sync user to our custom database via Drizzle ORM
    await syncUserToDb(verifiedUser);
    
    return verifiedUser;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      hydrated,
      signUp,
      signIn,
      signOut,
      sendOtp,
      verifyOtp,
    }),
    [user, hydrated, signUp, signIn, signOut, sendOtp, verifyOtp],
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
