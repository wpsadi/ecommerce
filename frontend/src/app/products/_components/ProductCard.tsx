import { Eye, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart.store";
import { formatINR } from "@/utils/currency";
import type { Product } from "../_hooks/products-load.paginated";
import { useProductStore } from "../_store/products.store";

function ProductCard({ product }: { product: Product }) {
  const { viewMode } = useProductStore();
  const { addItem } = useCartStore();
  return (
    <Card
      key={product.id}
      className={`group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${viewMode === "list" ? "flex flex-row" : ""}`}
    >
      <div
        className={`relative overflow-hidden bg-muted ${viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-square"}`}
      >
        <img
          src={product.mainImage || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.id === "2" && (
          <Badge className="absolute top-4 left-4 bg-success text-success-foreground">
            New
          </Badge>
        )}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-foreground/10 transition-colors duration-300" />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2">
            <Link href={`/products/${product.id}`}>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-card hover:bg-card/80"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              className="h-8 w-8 p-0 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() =>
                addItem({
                  productId: product.id,
                  quantity: 1,
                })
              }
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground text-lg leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>
        <p
          className={`text-muted-foreground text-sm mb-4 ${viewMode === "list" ? "line-clamp-3" : "line-clamp-2"}`}
        >
          {product.description ?? "No description available."}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-foreground">
            {formatINR(product.price)}
          </span>
          <Link href={`/products/${product.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:bg-muted bg-transparent"
            >
              View Details
            </Button>
          </Link>
        </div>
        {viewMode === "list" && (
          <div className="mt-4 flex gap-2">
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() =>
                addItem({
                  productId: product.id,
                  quantity: 1,
                })
              }
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ProductCard;
