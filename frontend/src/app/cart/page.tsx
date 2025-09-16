"use client";

import { ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";

import { useCartStore } from "@/store/cart.store";
import CartProduct from "./_components/CartProduct";
import CartSummary from "./_components/CartSummary";

export default function CartPage() {
  const { items } = useCartStore();
  const _router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Shopping Cart
              </h1>
              <p className="text-muted-foreground">
                {items.length === 0
                  ? "Your cart is empty"
                  : `${items.length} item${items.length !== 1 ? "s" : ""} in your cart`}
              </p>
            </div>

            {items.length === 0 ? (
              /* Empty Cart */
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Your cart is empty
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Looks like you haven't added any items to your cart yet. Start
                  shopping to fill it up!
                </p>
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item) => (
                    <CartProduct
                      productId={item.productId}
                      quantity={item.quantity}
                      key={item.productId}
                    />
                  ))}
                </div>

                {/* Order Summary */}
                <CartSummary />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
