import { useInfiniteQuery } from "@tanstack/react-query";

export interface Product {
  mainImage?: string;
  sideImages: string[];
  video?: string;
  business: {
    id: string;
    name: string;
  };
  quantity: number;
  businessId: string;
  id: string;
  name: string;
  description: string | null;
  price: number;
  createdAt: string; // comes as string from API
  updatedAt: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Response {
  error?: string;
  products: Product[];
  pagination: Pagination;
}

export const useProducts = () => {
  return useInfiniteQuery<Response>({
    queryKey: ["products"],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products?page=${pageParam}&limit=20`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      // if (!res.ok) throw new Error("Failed to fetch products");

      const data: Response = await res.json();
      if (data?.error) throw new Error(data.error);

      return data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.pagination.hasPrevPage
        ? firstPage.pagination.currentPage - 1
        : undefined,
    initialPageParam: 1, // ✅ required in v5
    staleTime: 1000 * 60 * 5,
  });
};
