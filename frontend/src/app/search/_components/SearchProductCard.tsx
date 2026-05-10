import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

interface SearchProduct {
  id: string;
  name: string;
  mainImage?: string;
  price: number;
}

export default function SearchProductCard({ product }: { product: SearchProduct }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
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
            />
          </div>

          <div className="mt-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-ink"></div>
              <div className="w-2 h-2 rounded-full border border-hairline"></div>
              <div className="w-2 h-2 rounded-full border border-hairline"></div>
            </div>

            <p className="text-ink font-[Helvetica_Now_Text_Medium,Helvetica,sans-serif] text-[16px] leading-tight mt-2 line-clamp-1">
              {product.name}
            </p>

            <div className="flex items-center justify-between mt-2">
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