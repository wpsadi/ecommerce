import { useQuery } from "@tanstack/react-query";

interface Response {
  error?: string;
  items: {
    product: {
      mainImage: string | undefined;
      sideImages: string[];
      video: string | undefined;
      business: {
        id: string;
        name: string;
      };
      id: string;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      quantity: number;
      price: number;
      businessId: string;
      description: string | null;
    };
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
  }[];
  user: {
    id: string;
    email: string;
    name: string;
  };
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

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${orderId}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      const data: Response = await res.json();
      if (data?.error) throw new Error(data.error);

      return data;
    },
    enabled: !!orderId,
    refetchOnWindowFocus: false,
  });
};
