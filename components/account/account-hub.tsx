"use client";

import { OrderHistory } from "@/components/account/order-history";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AccountHub() {
  const router = useRouter();
  const { user, isAuthenticated, hydrated, signOut } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.replace("/account/sign-in");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !user) {
    return null;
  }

  return (
    <div className="page-shell mx-auto max-w-lg px-4 py-8 pb-24 sm:px-6 lg:py-16 lg:pb-16">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/50">
        Your account
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-brand">
        {user.fullName}
      </h1>

      <dl className="mt-8 grid gap-6 border-t border-brand/10 pt-8 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand/45">
            Email
          </dt>
          <dd className="mt-1 text-sm font-medium text-brand">{user.email}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand/45">
            Phone
          </dt>
          <dd className="mt-1 text-sm font-medium text-brand">{user.phone}</dd>
        </div>
      </dl>

      <OrderHistory userId={user.id} />

      <div className="mt-10 flex flex-col gap-3 border-t border-brand/10 pt-8">
        <Link
          href="/shop"
          className="inline-flex justify-center border border-brand bg-brand px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90"
        >
          Continue shopping
        </Link>
        <button
          type="button"
          onClick={() => {
            signOut();
            router.push("/account/sign-in");
          }}
          className="border border-brand/25 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-brand transition-colors hover:border-brand"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
