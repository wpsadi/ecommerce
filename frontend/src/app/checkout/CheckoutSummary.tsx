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
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-lg mx-auto">
          <Card className="border-0 bg-canvas">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-[32px] font-[Helvetica_Now_Display_Medium,Helvetica,sans-serif] text-ink uppercase tracking-normal px-4 pt-4">
                Checkout
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4 text-center">
              <p className="text-mute text-[14px]">
                Add items to your cart to proceed to checkout.
              </p>
              <Link href="/products">
                <Button className="w-full h-[48px] bg-ink text-canvas rounded-[30px] px-8 text-[16px]">
                  Shop Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-lg mx-auto">
        <Card className="border-0 bg-canvas">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-[16px] text-ink px-4 pt-4">
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <div className="space-y-2">
              {data.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-sm"
                >
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
                  {formatINR(data.total)}
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
                <span>{formatINR(data.total)}</span>
              </div>
              <p className="text-[9px] text-mute mt-1">Including 18% GST</p>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              className="w-full h-[48px] bg-ink text-canvas rounded-[30px] px-8 text-[16px] mt-4"
              onClick={onPlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing ? "Placing Order..." : "Place Order"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
