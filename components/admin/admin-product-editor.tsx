"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import {
  getCatalogProductBySlug,
  saveAdminProduct,
} from "@/lib/product-catalog";
import type { Product } from "@/data/products";
import { toast } from "@/lib/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AdminProductEditorProps = {
  slug?: string;
};

export function AdminProductEditor({ slug }: AdminProductEditorProps) {
  const router = useRouter();
  const isNew = !slug;
  const initial = slug ? getCatalogProductBySlug(decodeURIComponent(slug)) : undefined;

  if (!isNew && !initial) {
    return (
      <AdminShell>
        <Link
          href="/admin/products"
          className="text-xs font-semibold uppercase tracking-[0.22em] text-brand/60 hover:text-brand"
        >
          ← Back to products
        </Link>
      </AdminShell>
    );
  }

  function handleSubmit(product: Product) {
    saveAdminProduct(product);
    toast.success(isNew ? "Product added" : "Product updated", {
      description: product.name,
    });
    router.push("/admin/products");
  }

  return (
    <AdminShell>
      <Link
        href="/admin/products"
        className="mb-4 inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/55 hover:text-brand"
      >
        ← Products
      </Link>

      <div className="max-w-2xl border border-brand/10 p-5 sm:p-6">
        <ProductForm
          initial={initial}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/products")}
          submitLabel={isNew ? "Add product" : "Save changes"}
        />
      </div>
    </AdminShell>
  );
}
