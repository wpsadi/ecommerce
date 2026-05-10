"use client";

import Link from "next/link";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import CartProduct from "./_components/CartProduct";
import CartSummary from "./_components/CartSummary";

export default function CartPage() {
  const { items } = useCartStore();

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-[32px] font-[Helvetica_Now_Display_Medium,Helvetica,sans-serif] text-ink uppercase tracking-normal">
                Shopping Cart
              </h1>
              <p className="text-mute text-[14px] mt-1">
                {items.length === 0
                  ? "Your cart is empty"
                  : `${items.length} item${items.length !== 1 ? "s" : ""} in your cart`}
              </p>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-ink text-[16px] font-medium mb-2">
                  Your cart is empty
                </h3>
                <p className="text-mute text-[14px] mb-6 max-w-md mx-auto">
                  Looks like you haven't added any items to your cart yet. Start
                  shopping to fill it up!
                </p>
                <Link href="/products">
                  <Button className="bg-ink text-canvas rounded-[30px] px-8 h-[48px] text-[16px]">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item) => (
                    <CartProduct
                      productId={item.productId}
                      quantity={item.quantity}
                      key={item.productId}
                    />
                  ))}
                </div>
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
