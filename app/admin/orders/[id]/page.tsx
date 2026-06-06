import { AdminOrderDetail } from "@/components/admin/admin-order-detail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Order ${decodeURIComponent(id)} | Admin | Yoghurt Clothing Gallery`,
  };
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <AdminOrderDetail orderId={id} />;
}
