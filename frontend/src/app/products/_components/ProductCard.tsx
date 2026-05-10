import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart.store";
import { useProductStore } from "../_store/products.store";
import type { Product } from "../_hooks/products-load.paginated";
import { motion } from "motion/react";

function ProductCard({ product }: { product: Product }) {
  const { viewMode } = useProductStore();
  const { addItem } = useCartStore();

  if (viewMode === "list") {
    return (
      <div className="flex flex-row overflow-hidden border-0 bg-canvas gap-4 p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="w-12 h-12 flex-shrink-0 bg-soft-cloud overflow-hidden"
        >
          <Image
            src={product.mainImage || "/placeholder.svg"}
            alt={product.name}
            fill
            quality={85}
            className="object-cover"
          />
        </motion.div>
        <div className="flex flex-col justify-between">
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-ink"></div>
            <div className="w-2 h-2 rounded-full border border-hairline"></div>
            <div className="w-2 h-2 rounded-full border border-hairline"></div>
          </div>
          <div>
            <Link href={`/products/${product.id}`} className="text-ink font-[Helvetica_Now_Text_Medium,Helvetica,sans-serif] text-[16px] leading-tight line-clamp-1">
              {product.name}
            </Link>
            <p className="text-mute text-[14px] font-[Helvetica_Now_Text,Helvetica,sans-serif] mt-1">
              Men's Training Shoes
            </p>
          </div>
          <span className="text-ink font-[Helvetica_Now_Text_Medium,Helvetica,sans-serif] text-[16px]">
            ₹{product.price}
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      whileHover={{ scale: 1.02 }}
      className="group overflow-hidden border-0 bg-canvas"
    >
      <div className="relative aspect-square bg-soft-cloud overflow-hidden">
        <Image
          src={product.mainImage || "/placeholder.svg"}
          alt={product.name}
          fill
          quality={85}
          className="object-cover"
        />
        {product.id === "2" && (
          <Badge className="absolute top-3 left-3 bg-canvas border border-hairline text-ink text-[12px] font-[Helvetica_Now_Text_Medium,Helvetica,sans-serif] rounded-full px-3 py-0.5">
            Just In
          </Badge>
        )}
      </div>

      <div className="px-0 py-0">
        <div className="flex items-center gap-1 mt-2">
          <div className="w-3 h-3 rounded-full bg-ink"></div>
          <div className="w-3 h-3 rounded-full border border-hairline"></div>
          <div className="w-3 h-3 rounded-full border border-hairline"></div>
        </div>

        <p className="text-ink font-[Helvetica_Now_Text_Medium,Helvetica,sans-serif] text-[16px] leading-tight mt-2 line-clamp-1">
          {product.name}
        </p>
        <p className="text-mute text-[14px] font-[Helvetica_Now_Text,Helvetica,sans-serif] mt-1">
          Men's Training Shoes
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-ink font-[Helvetica_Now_Text_Medium,Helvetica,sans-serif] text-[16px]">
            ₹{product.price}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;