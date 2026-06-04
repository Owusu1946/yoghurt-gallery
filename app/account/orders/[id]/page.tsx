import { OrderDetail } from "@/components/account/order-detail";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order ${decodeURIComponent(id)} · Yoghurt Clothing Gallery`,
  };
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <OrderDetail orderId={id} />;
}
