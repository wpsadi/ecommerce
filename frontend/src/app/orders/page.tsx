"use client";

import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import OrderList from "./_components/OrderList";

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                My Orders
              </h1>
              <p className="text-muted-foreground">
                Your order history and status.
              </p>
            </div>
            <OrderList />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
