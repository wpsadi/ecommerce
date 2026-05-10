"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useProductsFew } from "../_hooks/products-few";
import ProductCard from "./ProductCard";

function FeaturedProducts() {
  const { data, isError, isPending } = useProductsFew();

  return (
    <section className="py-12 bg-soft-cloud">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-[32px] font-[Helvetica_Now_Display_Medium,Helvetica,sans-serif] text-ink uppercase tracking-normal">
            Featured Products
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {data?.products.length === 0 && !isPending && !isError && (
            <div className="text-center py-12 col-span-full">
              <p className="text-mute text-lg">
                No featured products available.
              </p>
            </div>
          )}
          {data?.products.map((product, _index) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {isPending && (
            <div className="text-center py-12">
              <p className="text-mute text-lg">Loading Products...</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-12">
              <p className="text-sale text-lg">
                Error loading featured products.
              </p>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="mt-12"
        >
          <Link href="/products">
            <button
              type="button"
              className="bg-soft-cloud text-ink font-[Helvetica_Now_Text_Medium,Helvetica,sans-serif] rounded-full px-8 h-[48px] uppercase tracking-[0.05em] hover:bg-hairline transition-colors"
            >
              View All Products
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
