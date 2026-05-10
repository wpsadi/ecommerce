import { motion } from "motion/react";
import { useSearchProducts } from "../_hooks/useSearchProducts";
import SearchProductCard from "./SearchProductCard";

export default function SearchProductList({ query }: { query: string }) {
  const { data, isLoading, isError, error } = useSearchProducts(query);

  const products = data?.pages.flatMap((page) => page.products) || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
        {[...Array(6)].map((_, i) => (
          <div key={i.toString()} className="aspect-square bg-soft-cloud" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-destructive font-medium py-8 text-[14px]">
        {error instanceof Error ? error.message : "Failed to load products."}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-[16px] font-medium text-ink mb-2">
          No products found
        </h3>
        <p className="text-mute text-[14px]">
          Try adjusting your search terms or browse our categories
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0"
    >
      {products.map((product) => (
        <SearchProductCard
          key={product.id}
          product={{
            id: product.id,
            name: product.name,
            mainImage: product.mainImage || "",
            price: product.price,
          }}
        />
      ))}
    </motion.div>
  );
}
