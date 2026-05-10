import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart.store";
import { formatINR } from "@/utils/currency";
import { useProduct } from "../_hooks/loadProduct";

function CartProduct({ productId, quantity }: { productId: string; quantity: number }) {
  const { decreaseItemQuantity, increaseItemQuantity, removeItem } = useCartStore();
  const { data, isError, error, isPending } = useProduct(productId);

  if (isPending) {
    return (
      <Card className="border-0 bg-canvas">
        <CardContent className="p-0 flex items-center justify-center min-h-[120px]">
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-mute border-t-ink" />
            <span className="text-mute text-[14px] mt-2">Loading product...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="border-0 bg-canvas">
        <CardContent className="p-0 flex items-center justify-center min-h-[120px]">
          <div className="flex flex-col items-center gap-2 w-full">
            <span className="text-destructive text-[16px] font-medium">Error loading product</span>
            <span className="text-mute text-[14px]">{error?.message || "Product not found."}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-canvas">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          <div className="w-[96px] h-[96px] bg-soft-cloud flex-shrink-0 overflow-hidden">
            <Image
              src={data.mainImage || "/placeholder.svg"}
              alt={data.name}
              height={96}
              width={96}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <Link href={`/products/${productId}`}>
                  <h3 className="text-[16px] font-[Helvetica_Now_Text_Medium,Helvetica,sans-serif] text-ink line-clamp-2">
                    {data.name}
                  </h3>
                </Link>
                <p className="text-[14px] text-mute mt-1 line-clamp-1">{data.description}</p>
              </div>
              <Button
                variant="icon"
                className="h-[40px] w-[40px] rounded-full text-mute hover:text-destructive hover:bg-soft-cloud"
                onClick={() => removeItem(productId)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-[Helvetica_Now_Text_Medium,Helvetica,sans-serif] text-ink">
                  {formatINR(data.price)}
                </span>
                <span className="text-[14px] text-mute">each</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="icon"
                  className="bg-soft-cloud text-ink h-[40px] w-[40px] rounded-full"
                  onClick={() => decreaseItemQuantity(productId)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-[14px] font-medium">{quantity}</span>
                <Button
                  variant="icon"
                  className="bg-soft-cloud text-ink h-[40px] w-[40px] rounded-full"
                  onClick={() => increaseItemQuantity(productId)}
                  disabled={quantity >= data.quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-[16px] font-[Helvetica_Now_Text_Medium,Helvetica,sans-serif] text-ink min-w-[80px] text-right">
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
