import { Eye, RefreshCw, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/utils/currency";
import { getPaymentStatusColor } from "../_helpers/getPaymentStatusColor";
import type { OrderResponse } from "../_hooks/useOrders";
import ProductCard from "./ProductCard";
export default function OrderCard({
  order,
  onCancel,
}: {
  order: OrderResponse["orders"][number];
  onCancel?: (id: string) => void;
}) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Placed on{" "}
              {/* {new Date(order.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })} */}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* <Badge className={getStatusColor(order.status)}>
              {order.status.toUpperCase()}
            </Badge> */}
            <Badge className={getPaymentStatusColor(order.status)}>
              {order.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3 p-3 bg-muted rounded-lg">
              <ProductCard orderItem={item} />
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="flex justify-between items-center pt-3 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""} •
            Total:{" "}
            <span className="font-bold text-foreground text-lg">
              {formatINR(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Shipping Address */}
        {/* <div className="p-3 bg-muted rounded-lg">
          <h5 className="font-medium text-foreground mb-1">Shipping Address</h5>
          <p className="text-sm text-muted-foreground">
            {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.state} {order.shippingAddress.pincode}
          </p>
        </div> */}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href={`/orders/${order.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:bg-muted bg-background text-foreground"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </Link>

          {order.status === "PENDING" && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(order.id)}
              className="border-destructive text-destructive hover:bg-destructive/10 bg-background"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Order
            </Button>
          )}

          {order.status === "FAILED" && (
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Payment
            </Button>
          )}

          {order.status === "SUCCESSFULL" && (
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:bg-muted bg-background text-foreground"
            >
              Reorder
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
