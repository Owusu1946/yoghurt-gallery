import { SearchPage } from "@/components/search/search-page";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Search · Yoghurt Clothing Gallery",
  description: "Search graphic tees, plain tees, jerseys, and more.",
};

export default function SearchRoutePage() {
  return (
    <Suspense fallback={null}>
      <SearchPage />
    </Suspense>
  );
}
