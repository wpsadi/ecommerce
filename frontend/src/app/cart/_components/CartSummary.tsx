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
      <Card className="border-0 shadow-lg sticky top-8 bg-background">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32 bg-muted" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i.toString()} className="flex justify-between text-sm">
                <Skeleton className="h-4 w-24 bg-muted" />
                <Skeleton className="h-4 w-12 bg-muted" />
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <Skeleton className="h-4 w-20 bg-muted" />
              <Skeleton className="h-4 w-12 bg-muted" />
            </div>
            <div className="flex justify-between text-sm">
              <Skeleton className="h-4 w-20 bg-muted" />
              <Skeleton className="h-4 w-12 bg-muted" />
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex justify-between text-lg font-bold">
              <Skeleton className="h-5 w-16 bg-muted" />
              <Skeleton className="h-5 w-16 bg-muted" />
            </div>
            <Skeleton className="h-3 w-28 bg-muted mt-1" />
          </div>
          <Skeleton className="w-full h-12 bg-muted mt-6" />
          <Skeleton className="w-full h-10 bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-0 shadow-lg sticky top-8 opacity-80 pointer-events-none bg-background">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <div className="text-destructive text-center font-semibold">
            {error instanceof Error
              ? error.message
              : "Failed to load cart summary."}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg sticky top-8 bg-background">
      <CardHeader>
        <CardTitle className="text-foreground">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items Breakdown */}
        <div className="space-y-2">
          {data?.items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium text-foreground">
                {formatINR(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">
              {formatINR(data?.total)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">{formatINR(data?.total)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Including 18% GST
          </p>
        </div>

        {/* Checkout Button */}
        <Link href="/checkout" className="block">
          <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground mt-6">
            Proceed to Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        {/* Continue Shopping */}
        <Link href="/products">
          <Button
            variant="outline"
            className="w-full h-10 border-border hover:bg-muted bg-background text-foreground"
          >
            Continue Shopping
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default CartSummary;
