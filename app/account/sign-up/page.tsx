import { SignUpFlow } from "@/components/auth/sign-up-flow";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Create account · Yoghurt Clothing Gallery",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpFlow />
    </Suspense>
  );
}
