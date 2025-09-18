import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cart.store";
import { formatINR } from "@/utils/currency";
import { useCartSummary } from "../cart/_hooks/loadCartSummary";

export function CheckoutSummary({
  onPlaceOrder,
  isProcessing,
  error,
}: {
  onPlaceOrder: () => void;
  isProcessing: boolean;
  error: string;
}) {
  const { data, isPending, isError } = useCartSummary();
  const { items } = useCartStore();

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        Loading...
      </div>
    );
  }
  if (isError || !data) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load cart summary.</AlertDescription>
      </Alert>
    );
  }
  if (!items || items.length === 0) {
    return (
      <Card className="border-0 shadow-lg max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Your cart is empty</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground mb-4">
            Add items to your cart to proceed to checkout.
          </p>
          <Link href="/products">
            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground">
              Shop Now
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {data.items.map((item) => (
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
              {formatINR(data.total)}
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
            <span className="text-foreground">{formatINR(data.total)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Including 18% GST
          </p>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground mt-6"
          onClick={onPlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? "Placing Order..." : "Place Order"}
        </Button>
      </CardContent>
    </Card>
  );
}
