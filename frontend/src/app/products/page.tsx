"use client";

import { Grid, List } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DisplayProducts from "./_components/DisplayProducts";

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-muted-foreground mb-2">
          All Products
        </h1>
        <p className="text-muted-foreground">
          Discover our complete collection of handcrafted items
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 bg-muted rounded-lg">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

          {/* <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select> */}

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="flex-1"
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="flex-1"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <DisplayProducts />
    </div>
  );
}
