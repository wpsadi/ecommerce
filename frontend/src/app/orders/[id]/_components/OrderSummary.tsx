import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/utils/currency";

export default function OrderSummary({ totalAmount }: { totalAmount: number }) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">
              {formatINR(Math.round(totalAmount / 1.18))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">GST (18%)</span>
            <span className="font-medium text-foreground">
              {formatINR(totalAmount - Math.round(totalAmount / 1.18))}
            </span>
          </div>
        </div>
        <div className="border-t border-border pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">{formatINR(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
