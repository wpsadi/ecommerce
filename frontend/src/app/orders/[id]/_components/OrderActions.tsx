import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order } from "@/types/type";

export default function OrderActions({
  order,
  isProcessing,
  onCancel,
}: {
  order: Order;
  isProcessing: boolean;
  onCancel: () => void;
  onRetryPayment: () => void;
}) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Order Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {order.status === "pending" ||
          (order.status === "paid" && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="w-full border-destructive text-destructive hover:bg-destructive/10 bg-background"
            >
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent"></div>
                  Cancelling...
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancel Order
                </>
              )}
            </Button>
          ))}

        {order.status === "delivered" && (
          <Button
            variant="outline"
            className="w-full border-border hover:bg-muted bg-background text-foreground"
          >
            Reorder Items
          </Button>
        )}

        <Button
          variant="outline"
          className="w-full border-border hover:bg-muted bg-background text-foreground"
        >
          Download Invoice
        </Button>
      </CardContent>
    </Card>
  );
}
