"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateOrder } from "./_hooks/useCreateOrder";
import { CheckoutSummary } from "./CheckoutSummary";

export default function CheckoutPage() {
  const _router = useRouter();

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <CheckoutSummary
          onPlaceOrder={handlePlaceOrder}
          isProcessing={isProcessing}
          error={error}
        />
      </div>
    </div>
  );
}
