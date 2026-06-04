"use client";

import { WishlistContents } from "@/components/wishlist/wishlist-contents";

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-3xl flex-1 px-6 py-12 lg:py-16">
      <WishlistContents variant="page" />
    </div>
  );
}
