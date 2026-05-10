"use client";

import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/store/cart.store";

interface Response {
  error?: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    totalPrice: number;
  }[];
  total: number;
}

export const useCartSummary = () => {
  const items = useCartStore((state) => state.items);
  return useQuery({
    queryKey: ["cart-summary", items], // include items in the key
    queryFn: async ({ queryKey }) => {
      const [_key, itemsArg] = queryKey;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/bill`,
        {
          method: "POST",
          body: JSON.stringify({ items: itemsArg }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        },
      );
      const data: Response = await res.json();
      if (data?.error) throw new Error(data.error);
      return data;
    },

    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
};
