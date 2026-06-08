"use client";

import { useAdmin } from "@/context/admin-context";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const labelClass =
  "text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/60";
const fieldClass =
  "mt-2 w-full border border-brand/20 bg-white px-3 py-2.5 text-sm text-brand outline-none focus:border-brand";

export function AdminSignInForm() {
  const { signIn } = useAdmin();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const ok = await signIn(email, password);
    setLoading(false);

    if (!ok) {
      toast.error("Sign in failed", {
        description: "Check your admin email and password.",
      });
      return;
    }

    toast.success("Welcome back");
    router.replace("/admin");
  }

  return (
    <div className="page-shell mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <header className="mb-8 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/50">
          Yoghurt Admin
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-brand">
          Sign in
        </h1>
        <p className="mt-3 text-sm text-brand/65">
          Enter your admin credentials to continue.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="border border-brand/10 bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="admin-email" className={labelClass}>
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="mt-5">
          <label htmlFor="admin-password" className={labelClass}>
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full border border-brand bg-brand px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
