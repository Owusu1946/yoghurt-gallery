import { categoryMeta, getCategoryFromCollectionSlug } from "@/data/products";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ category: string }>;
};

export default async function ShopCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const productCategory = getCategoryFromCollectionSlug(category);

  if (!productCategory) {
    redirect("/shop");
  }

  const collectionSlug = categoryMeta[productCategory].collectionSlug;
  redirect(`/shop?category=${collectionSlug}`);
}
