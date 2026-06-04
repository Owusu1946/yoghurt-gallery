import { ProductDetail } from "@/components/shop/product-detail";
import { allProducts, getProductBySlug } from "@/data/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return allProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product | Yoghurt Clothing Gallery" };
  }

  return {
    title: `${product.name} | Yoghurt Clothing Gallery`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="page-shell flex flex-1 flex-col bg-white">
      <ProductDetail product={product} />
    </div>
  );
}
