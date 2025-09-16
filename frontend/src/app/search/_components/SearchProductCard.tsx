import { Eye, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart.store";
import type { Product } from "@/types/type";
import { formatINR } from "@/utils/currency";

export default function SearchProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.mainImage || "/placeholder.svg"}
          alt={product.name}
          height={300}
          width={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2">
            <Link href={`/products/${product.id}`}>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-background hover:bg-muted"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              className="h-8 w-8 p-0 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => addItem({ productId: product.id, quantity: 1 })}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground text-lg leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        {/* <div className="flex flex-wrap gap-1 mb-4">
          {product.tags?.slice(0, 2).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div> */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-foreground">
            {formatINR(product.price)}
          </span>
          <Link href={`/products/${product.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:bg-muted bg-background text-foreground"
            >
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
