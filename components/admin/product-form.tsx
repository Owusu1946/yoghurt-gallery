"use client";

import { ProductImagesUpload } from "@/components/admin/product-image-upload";
import {
  PRODUCT_SIZES,
  categoryMeta,
  type Product,
  type ProductCategory,
} from "@/data/products";
import { cn } from "@/lib/cn";
import { slugify } from "@/lib/slugify";
import { useMemo, useState } from "react";

const categories = Object.keys(categoryMeta) as ProductCategory[];

type ProductFormProps = {
  initial?: Product;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
  submitLabel?: string;
};

const fieldClass =
  "mt-2 w-full border border-brand/20 bg-white px-3 py-2.5 text-sm text-brand outline-none focus:border-brand";
const labelClass =
  "text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/60";

export function ProductForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save product",
}: ProductFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [image, setImage] = useState(initial?.image ?? "");
  const [imageBack, setImageBack] = useState(initial?.imageBack ?? "");
  const [priceGhs, setPriceGhs] = useState(String(initial?.priceGhs ?? ""));
  const [stock, setStock] = useState(
    initial?.stock !== undefined ? String(initial.stock) : "",
  );
  const [category, setCategory] = useState<ProductCategory>(
    initial?.category ?? "tees-designed",
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [detailsText, setDetailsText] = useState(
    (initial?.details ?? []).join("\n"),
  );
  const [error, setError] = useState<string | null>(null);

  const previewSlug = useMemo(() => {
    if (slugTouched) return slugify(slug);
    return slugify(name);
  }, [name, slug, slugTouched]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const price = Number(priceGhs);
    const stockQty = Number(stock);
    const details = detailsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!previewSlug) {
      setError("A valid slug is required.");
      return;
    }
    if (!image) {
      setError("Upload a front image.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid price in GHS.");
      return;
    }
    const trackStock = stock.trim() !== "";
    if (trackStock && (!Number.isFinite(stockQty) || stockQty < 0)) {
      setError("Enter a valid stock quantity.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    setError(null);
    onSubmit({
      slug: previewSlug,
      name: name.trim(),
      image,
      imageBack: imageBack || undefined,
      priceGhs: Math.round(price),
      stock: trackStock ? Math.round(stockQty) : undefined,
      category,
      description: description.trim(),
      details: details.length > 0 ? details : ["Made to order in Accra"],
      colors: initial?.colors,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProductImagesUpload
        front={image}
        back={imageBack}
        onFrontChange={setImage}
        onBackChange={setImageBack}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="product-name" className={labelClass}>
            Name
          </label>
          <input
            id="product-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="product-slug" className={labelClass}>
            Slug
          </label>
          <input
            id="product-slug"
            value={slugTouched ? slug : previewSlug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="product-price" className={labelClass}>
            Price (GHS)
          </label>
          <input
            id="product-price"
            type="number"
            min={1}
            value={priceGhs}
            onChange={(e) => setPriceGhs(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="product-stock" className={labelClass}>
            Stock
          </label>
          <input
            id="product-stock"
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={fieldClass}
            placeholder="Unlimited"
          />
        </div>
        <div>
          <label htmlFor="product-category" className={labelClass}>
            Category
          </label>
          <select
            id="product-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className={cn(fieldClass, "cursor-pointer")}
          >
            {categories.map((id) => (
              <option key={id} value={id}>
                {categoryMeta[id].title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="product-description" className={labelClass}>
          Description
        </label>
        <textarea
          id="product-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="product-details" className={labelClass}>
          Details (one per line)
        </label>
        <textarea
          id="product-details"
          rows={4}
          value={detailsText}
          onChange={(e) => setDetailsText(e.target.value)}
          className={fieldClass}
        />
      </div>

      <p className="text-xs text-brand/50">
        Sizes: {PRODUCT_SIZES.join(", ")}. Stock at 0 shows sold out on the shop.
      </p>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="border border-brand bg-brand px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-brand/25 px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand transition-opacity hover:opacity-70"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
