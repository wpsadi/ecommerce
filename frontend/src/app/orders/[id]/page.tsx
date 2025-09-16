"use client";

import {
  ArrowLeft,
  CheckCircle,
  Mail,
  Package,
  Phone,
  Truck,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OrderActions from "./_components/OrderActions";
import {
  CancelledOrderAlert,
  PaymentFailedAlert,
} from "./_components/OrderAlerts";
import OrderItems from "./_components/OrderItems";
import OrderSummary from "./_components/OrderSummary";
import { useOrder } from "./_hooks/useOrder";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data, isError, isPending, error } = useOrder(params.id as string);
  const [isProcessing, _setIsProcessing] = useState(false);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-destructive text-lg font-semibold">
          {error instanceof Error ? error.message : "Order not found."}
        </div>
      </div>
    );
  }

  const order = data;

  // Progress steps logic
  const steps = [
    { key: "pending", label: "Order Placed", icon: Package },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
  ];
  const currentIndex = steps.findIndex((step) => step.key === order.status);
  const isCancelled = order.status === "cancelled";
  const orderProgress = steps.map((step, index) => ({
    ...step,
    completed: !isCancelled && index <= currentIndex,
    current: !isCancelled && index === currentIndex,
    cancelled: isCancelled,
  }));

  // Handlers (dummy for now, wire up with mutation hooks as needed)
  const handleCancelOrder = async () => {
    // TODO: wire up with mutation
    alert("Cancel order not implemented");
  };
  const handleRetryPayment = async () => {
    // TODO: wire up with mutation
    alert("Retry payment not implemented");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 p-2 hover:bg-muted"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>

        {/* Order Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Order #{order.id}
              </h1>
              <p className="text-muted-foreground mt-1">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{order.status.toUpperCase()}</Badge>
              <Badge>{order.status.toUpperCase()}</Badge>
            </div>
          </div>

          {/* Order Progress */}
          {order.status !== "cancelled" && (
            <div className="border-0 shadow-lg mb-6 rounded-lg bg-muted">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  {orderProgress.map((step, index) => (
                    <div key={step.key} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-green-500 text-white"
                              : step.current
                                ? "bg-blue-500 text-white"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <step.icon className="h-5 w-5" />
                        </div>
                        <span
                          className={`text-xs mt-2 text-center ${
                            step.completed || step.current
                              ? "text-foreground font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {index < orderProgress.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-4 ${step.completed ? "bg-green-500" : "bg-muted"}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cancelled Order Alert */}
          {order.status === "cancelled" && <CancelledOrderAlert />}

          {/* Payment Failed Alert */}
          {order.status === "failed" && (
            <PaymentFailedAlert
              onRetry={handleRetryPayment}
              isProcessing={isProcessing}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <OrderItems items={order.items} />
            {/* <ShippingAddress address={order.shippingAddress} /> */}
          </div>

          {/* Order Summary & Actions */}
          <div className="lg:col-span-1 space-y-6">
            <OrderSummary totalAmount={order.totalAmount} />
            <OrderActions
              order={order}
              isProcessing={isProcessing}
              onCancel={handleCancelOrder}
              onRetryPayment={handleRetryPayment}
            />
            {/* Support */}
            <div className="border-0 shadow-lg rounded-lg bg-muted">
              <div className="p-6 space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-border hover:bg-background bg-background text-foreground"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Support
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-border hover:bg-background bg-background text-foreground"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
