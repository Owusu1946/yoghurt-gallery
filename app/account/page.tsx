import { AccountHub } from "@/components/account/account-hub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account · Yoghurt Clothing Gallery",
};

export default function AccountPage() {
  return <AccountHub />;
}
