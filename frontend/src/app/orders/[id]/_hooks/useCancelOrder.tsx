import { useMutation } from "@tanstack/react-query";

interface Response {
  error?: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  userId: string;
  totalAmount: number;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
}
export const useCancelOrder = (orderId: string) => {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${orderId}/cancel`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        },
      );

      const data: Response = await res.json();
      if (data?.error) throw new Error(data.error);

      return data;
    },
  });
};
