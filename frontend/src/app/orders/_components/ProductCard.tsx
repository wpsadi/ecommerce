import Image from "next/image";
import { useProduct } from "@/app/products/[id]/_hooks/loadProduct";
import { Skeleton } from "@/components/ui/skeleton";
import { formatINR } from "@/utils/currency";
import type { OrderResponse } from "../_hooks/useOrders";

function ProductCard({
  orderItem,
}: {
  orderItem: OrderResponse["orders"][number]["items"][number];
}) {
  const { data, isPending, error } = useProduct(orderItem.productId);

  if (isPending) {
    return (
      <>
        <Skeleton className="w-16 h-16 rounded flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-40 mb-2" />
          <div className="flex items-center gap-4 mt-1">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </>
    );
  }
  if (error || !data) {
    return (
      <>
        <div className="w-16 h-16 bg-background rounded flex-shrink-0 flex items-center justify-center text-xs text-red-500 border">
          !
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-red-500 text-sm">Failed to load product</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-16 h-16 bg-background rounded overflow-hidden flex-shrink-0">
        <Image
          src={data.mainImage || "/placeholder.svg"}
          alt={data.name}
          height={64}
          width={64}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground line-clamp-1">
          {data.name}
        </h4>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {data.description}
        </p>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-sm text-muted-foreground">
            Qty: {orderItem.quantity}
          </span>
          <span className="font-medium text-foreground">
            {formatINR(orderItem.price * orderItem.quantity)}
          </span>
        </div>
      </div>
    </>
  );
}

export default ProductCard;
