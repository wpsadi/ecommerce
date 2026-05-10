import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import type { Product } from "../products/_hooks/products-load.paginated";

function ProductCard({ product }: { product: Product }) {
  // addItem is available from useCartStore if needed
  void useCartStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      whileHover={{ scale: 1.02 }}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="bg-canvas rounded-none p-0">
          <div className="relative aspect-square bg-soft-cloud">
            <Image
              src={product.mainImage || "/placeholder.svg"}
              alt={product.name}
              fill
              quality={85}
              className="object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex items-center gap-1 mt-2">
            <div className="w-3 h-3 rounded-full bg-ink"></div>
            <div className="w-3 h-3 rounded-full border border-hairline"></div>
            <div className="w-3 h-3 rounded-full border border-hairline"></div>
          </div>

          <div className="mt-2">
            <p className="text-ink font-[Helvetica_Now_Text_Medium,Helvetica,sans-serif] text-[16px] leading-tight line-clamp-2">
              {product.name}
            </p>
            <p className="text-mute text-[14px] font-[Helvetica_Now_Text,Helvetica,sans-serif] mt-1">
              Men's Training Shoes
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-ink font-[Helvetica_Now_Text_Medium,Helvetica,sans-serif] text-[16px]">
                ₹{product.price}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;
