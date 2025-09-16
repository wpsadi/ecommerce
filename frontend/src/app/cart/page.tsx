"use client";

import { ArrowRight, ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { useCartStore } from "@/store/cart.store";
import CartProduct from "./_components/CartProduct";

export default function CartPage() {
  const { isPending, data: authData, error } = useUser();
  const {
    addItem,
    items,
    clearCart,
    decreaseItemQuantity,
    increaseItemQuantity,
  } = useCartStore();
  const _router = useRouter();

  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Shopping Cart
            </h1>
            <p className="text-slate-600">
              {items.length === 0
                ? "Your cart is empty"
                : `${items.length} item${items.length !== 1 ? "s" : ""} in your cart`}
            </p>
          </div>

          {items.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start
                shopping to fill it up!
              </p>
              <Link href="/products">
                <Button className="bg-slate-900 hover:bg-slate-800">
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
                    key={item.id}
                  />
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-lg sticky top-8">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items Breakdown */}
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-slate-600">
                            {item.product.name} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatINR(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-medium">{formatINR(total)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Shipping</span>
                        <span className="font-medium text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tax</span>
                        <span className="font-medium">
                          {formatINR(Math.round(total * 0.18))}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>
                          {formatINR(total + Math.round(total * 0.18))}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Including 18% GST
                      </p>
                    </div>

                    {/* Checkout Button */}
                    <Link href="/checkout" className="block">
                      <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800 mt-6">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>

                    {/* Continue Shopping */}
                    <Link href="/products">
                      <Button
                        variant="outline"
                        className="w-full h-10 border-slate-300 hover:bg-slate-50 bg-transparent"
                      >
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
