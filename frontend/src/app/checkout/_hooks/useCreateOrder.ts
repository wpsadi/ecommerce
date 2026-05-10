"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { useCartStore } from "@/store/cart.store";

interface Response {
  error?: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    id: string;
    orderId: string;
  }[];
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  totalAmount: number;
  status: "CREATED" | "PENDING" | "FAILED" | "PAID";
  razorpayOrderId: string;
  razorpayKeyId: string;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
}

export function useCreateOrder() {
  const items = useCartStore((s) => s.items);
  const { Razorpay } = useRazorpay();
  const clearCart = useCartStore((s) => s.clearCart);
  const { data: userData } = useUser();
  const _router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        },
      );
      if (!res.ok) throw new Error("Failed to create order");
      const data: Response = await res.json();
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess(data, _variables, _context) {
      clearCart();
      const paymentNote = `Order Payment for Order ID: ${data.id} and Amount: ₹${data.totalAmount}`;
      // amt will be in rs only we convert to float with ending .00 if not present
      data.totalAmount = parseFloat(data.totalAmount.toFixed(2)) * 100; // convert to paise

      if (!Razorpay) {
        toast.error("Razorpay SDK not loaded");
        return;
      }

      const options: RazorpayOrderOptions = {
        key: data.razorpayKeyId,
        amount: data.totalAmount, // Amount in paise
        currency: "INR",
        name: "Ecommerce Shop",
        description: paymentNote,
        order_id: data.razorpayOrderId,
        callback_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments/razorpay/callback`,
        prefill: {
          name: userData?.user.name,
          email: userData?.user.email,
        },
        theme: {
          color: "#000",
        },
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
    },
  });
}
