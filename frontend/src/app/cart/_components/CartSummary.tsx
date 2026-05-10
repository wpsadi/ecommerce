import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatINR } from "@/utils/currency";
import { useCartSummary } from "../_hooks/loadCartSummary";

function CartSummary() {
  const { data, isError, isPending, error } = useCartSummary();

  if (isPending) {
    return (
      <Card className="border-0 bg-canvas sticky top-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-[16px] text-ink px-4 pt-4">
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between text-sm">
                <Skeleton className="h-4 w-24 bg-soft-cloud" />
                <Skeleton className="h-4 w-12 bg-soft-cloud" />
              </div>
            ))}
          </div>
          <div className="border-t border-hairline pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <Skeleton className="h-4 w-20 bg-soft-cloud" />
              <Skeleton className="h-4 w-12 bg-soft-cloud" />
            </div>
            <div className="flex justify-between text-sm">
              <Skeleton className="h-4 w-20 bg-soft-cloud" />
              <Skeleton className="h-4 w-12 bg-soft-cloud" />
            </div>
          </div>
          <div className="border-t border-hairline pt-3">
            <div className="flex justify-between text-[16px] font-medium text-ink">
              <Skeleton className="h-5 w-16 bg-soft-cloud" />
              <Skeleton className="h-5 w-16 bg-soft-cloud" />
            </div>
          </div>
          <Skeleton className="w-full h-[48px] bg-soft-cloud mt-4" />
          <Skeleton className="w-full h-[48px] bg-soft-cloud" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-0 bg-canvas sticky top-6 opacity-80 pointer-events-none">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-[16px] text-ink px-4 pt-4">
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex flex-col items-center gap-3 p-8">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <div className="text-destructive text-center font-medium text-[14px]">
            {error instanceof Error
              ? error.message
              : "Failed to load cart summary."}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-canvas sticky top-6">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-[16px] text-ink px-4 pt-4">
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        <div className="space-y-2">
          {data?.items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-mute">
                {item.name} × {item.quantity}
              </span>
              <span className="text-ink font-medium">
                {formatINR(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-hairline pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-mute">Subtotal</span>
            <span className="text-ink font-medium">
              {formatINR(data?.total || 0)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-mute">Shipping</span>
            <span className="text-ink font-medium">Free</span>
          </div>
        </div>

        <div className="border-t border-hairline pt-3">
          <div className="flex justify-between text-[16px] font-medium text-ink">
            <span>Total</span>
            <span>{formatINR(data?.total || 0)}</span>
          </div>
          <p className="text-[9px] text-mute mt-1">Including 18% GST</p>
        </div>

        <Link href="/checkout" className="block">
          <Button className="w-full h-[48px] bg-ink text-canvas rounded-[30px] px-8 text-[16px] mt-4">
            Proceed to Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        <Link href="/products">
          <Button
            variant="secondary"
            className="w-full h-[48px] rounded-[30px] px-8 text-[16px]"
          >
            Continue Shopping
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default CartSummary;
