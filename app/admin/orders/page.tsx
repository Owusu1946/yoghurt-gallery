import { AdminOrdersList } from "@/components/admin/admin-orders-list";

import { Suspense } from "react";

export const metadata = {
  title: "Orders | Admin | Yoghurt Clothing Gallery",
};

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={null}>
      <AdminOrdersList />
    </Suspense>
  );
}
