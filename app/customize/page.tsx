import { CustomizerStudio } from "@/components/customizer/customizer-studio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customize Your Tee | Yoghurt Clothing Gallery",
  description:
    "Upload front and back designs, preview on your tee, and order custom prints from Yoghurt Clothing Gallery.",
};

export default function CustomizePage() {
  return (
    <main className="page-shell flex flex-1 flex-col bg-white">
      <CustomizerStudio />
    </main>
  );
}
