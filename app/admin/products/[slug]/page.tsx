import { AdminProductEditor } from "@/components/admin/admin-product-editor";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return {
    title: `Edit ${decodeURIComponent(slug)} | Admin | Yoghurt Clothing Gallery`,
  };
}

export default async function AdminEditProductPage({ params }: PageProps) {
  const { slug } = await params;
  return <AdminProductEditor slug={slug} />;
}
