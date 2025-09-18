"use client";

import { CheckCircle, Home, Package, Receipt } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const id = searchParams.get("orderId");
    if (id) {
      setOrderId(id);
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-success/10 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-background/80 backdrop-blur-sm mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-foreground">
              Order Confirmation
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your order has been received and is being processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Details */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-foreground">Order ID:</span>
                <span className="font-mono text-muted-foreground">
                  #{orderId}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-foreground">Order Date:</span>
                <span className="text-muted-foreground">
                  {new Date().toLocaleDateString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">
                  Payment Status:
                </span>
                <span className="text-success font-medium">Paid</span>
              </div>
            </div>

            {/* What's Next */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">
                What happens next?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-info/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-info rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      Order Confirmation
                    </p>
                    <p className="text-sm text-slate-600">
                      You'll receive an email confirmation shortly
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Processing</p>
                    <p className="text-sm text-slate-600">
                      We'll prepare your items for shipping
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Shipping</p>
                    <p className="text-sm text-slate-600">
                      Your order will be shipped within 2-3 business days
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Delivery</p>
                    <p className="text-sm text-slate-600">
                      Estimated delivery in 5-7 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href={`/orders/${orderId}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full h-12 border-slate-300 hover:bg-slate-50 bg-transparent"
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  View Order Details
                </Button>
              </Link>
              <Link href="/products" className="flex-1">
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Package className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <div className="text-center pt-4 border-t">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="text-center">
          <p className="text-muted-foreground mb-2">
            Need help with your order?
          </p>
          <Button variant="link" className="text-foreground p-0">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
