"use client";

import { AlertTriangle, Home, Package, XCircle } from "lucide-react";
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

export default function CheckoutFailurePage() {
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-destructive"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Failure Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-destructive/10 rounded-full mx-auto mb-6 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-destructive mb-2">
            Order Failed
          </h1>
          <p className="text-muted-foreground text-lg">
            We couldn't process your order
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-background/80 backdrop-blur-sm mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-destructive">
              Order Failed
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              We couldn't process your order. Please try again or contact
              support.
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
                <span className="text-destructive font-medium">Failed</span>
              </div>
            </div>

            {/* What Happened */}
            <div className="space-y-4">
              <h3 className="font-semibold text-destructive flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Order could not be
                completed
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <XCircle className="w-4 h-4 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium text-destructive">
                      Payment Failed
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your payment could not be processed. Please check your
                      payment details or try another method.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Order Not Placed
                    </p>
                    <p className="text-sm text-muted-foreground">
                      No items have been reserved or shipped.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/cart" className="flex-1">
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Package className="mr-2 h-4 w-4" />
                  Try Again / Go to Cart
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full h-12 border-destructive text-destructive"
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
          <Button variant="link" className="text-destructive p-0">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
