"use client";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { useState } from "react";
import { useCreateOrder } from "./_hooks/useCreateOrder";
import { CheckoutSummary } from "./CheckoutSummary";

export default function CheckoutPage() {
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { mutateAsync } = useCreateOrder();

  const handlePlaceOrder = async () => {
    setError("");
    setIsProcessing(true);
    try {
      await mutateAsync();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-lg mx-auto">
          <h1 className="text-[32px] font-[Helvetica_Now_Display_Medium,Helvetica,sans-serif] text-ink uppercase tracking-normal mb-6">
            Checkout
          </h1>
          <CheckoutSummary
            onPlaceOrder={handlePlaceOrder}
            isProcessing={isProcessing}
            error={error}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
