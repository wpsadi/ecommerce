"use client";

import { Grid, List } from "lucide-react";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import DisplayProducts from "./_components/DisplayProducts";
import { useProductStore } from "./_store/products.store";

export default function ProductsPage() {
  const { viewMode, setViewMode } = useProductStore();

  //   const categories = ["all", ...Array.from(new Set(dummyProducts.map((p) => p.category)))]

  //   const filteredProducts = dummyProducts
  //     .filter((product) => filterCategory === "all" || product.category === filterCategory)
  //     .sort((a, b) => {
  //       switch (sortBy) {
  //         case "price-low":
  //           return a.price - b.price
  //         case "price-high":
  //           return b.price - a.price
  //         case "name":
  //           return a.name.localeCompare(b.name)
  //         default:
  //           return 0
  //       }
  //     })

  return (
    <div className="min-h-screen bg-canvas">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-[Helvetica_Now_Display_Medium,Helvetica,sans-serif] text-ink uppercase tracking-normal mb-2">
            All Products
          </h1>
          <p className="text-mute text-[14px]">
            Discover our complete collection of handcrafted items
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 bg-soft-cloud">
          <div className="flex-1" />

          <div className="flex gap-3">
            <Button
              variant={viewMode === "grid" ? "default" : "secondary"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="flex-1 rounded-full"
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "secondary"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="flex-1 rounded-full"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <DisplayProducts />
      </div>

      <Footer />
    </div>
  );
}
