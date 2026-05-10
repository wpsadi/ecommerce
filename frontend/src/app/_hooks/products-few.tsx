"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  Pagination,
  Product,
} from "../products/_hooks/products-load.paginated";

interface Response {
  error?: string;
  products: Product[];
  pagination: Pagination;
}

export const useProductsFew = (businessId?: string) => {
  return useQuery<Response>({
    queryKey: ["products-few", businessId],
    queryFn: async () => {
      const res = await fetch(
        new URL(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products?page=1&limit=3`,
        ),
      );
      if (!res.ok) throw new Error("Failed to fetch products");

      const data: Response = await res.json();

      if (data?.error) throw new Error(data.error);

      return data;
    },
  });
};
