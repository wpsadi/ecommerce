import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/types/type";

interface Response extends Product {
  error?: string;
}

export const useProduct = (id: string) => {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}`,
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
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
