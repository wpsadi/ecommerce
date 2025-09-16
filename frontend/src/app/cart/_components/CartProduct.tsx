import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart.store";
import { formatINR } from "@/utils/currency";
import { useProduct } from "../_hooks/loadProduct";

function CartProduct({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) {
  const { decreaseItemQuantity, increaseItemQuantity, removeItem } =
    useCartStore();
  const { data, isError, error, isPending } = useProduct(productId);
  if (isPending) {
    return (
      <Card
        key={productId}
        className="border-0 shadow-lg opacity-70 pointer-events-none"
      >
        <CardContent className="p-6 flex items-center justify-center min-h-[120px]">
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-muted-foreground border-t-primary" />
            <span className="text-muted-foreground text-base mt-2">
              Loading product...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card
        key={productId}
        className="border-0 shadow-lg opacity-70 pointer-events-none"
      >
        <CardContent className="p-6 flex items-center justify-center min-h-[120px]">
          <div className="flex flex-col items-center gap-2 w-full">
            <span className="text-destructive text-lg font-semibold">
              Error loading product
            </span>
            <span className="text-muted-foreground text-sm">
              {error?.message || "Product not found or unavailable."}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card key={productId} className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={data.mainImage || "/placeholder.svg"}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Link href={`/products/${productId}`}>
                  <h3 className="font-semibold text-foreground hover:text-muted-foreground line-clamp-2">
                    {data.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {data.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(productId)}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Price and Quantity */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-foreground">
                  {formatINR(data.price)}
                </span>
                <span className="text-sm text-muted-foreground">each</span>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-muted-foreground rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => decreaseItemQuantity(productId)}
                    className="h-8 w-8 p-0 hover:bg-muted"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-12 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => increaseItemQuantity(productId)}
                    className="h-8 w-8 p-0 hover:bg-muted"
                    disabled={quantity >= data.quantity}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <span className="text-lg font-bold text-foreground min-w-[80px] text-right">
                  {formatINR(data.price * quantity)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CartProduct;
