import { ProductDetailLoader } from "@/components/shop/product-detail-loader";
import { getAllProductsFromDb } from "@/app/actions/product-catalog";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getAllProductsFromDb();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const products = await getAllProductsFromDb();
  const product = products.find((p) => p.slug === slug);

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
  const products = await getAllProductsFromDb();
  const product = products.find((p) => p.slug === slug);

  return (
    <div className="page-shell flex flex-1 flex-col bg-white">
      <ProductDetailLoader slug={slug} staticProduct={product ?? null} />
    </div>
  );
}
