import { useInfiniteQuery } from "@tanstack/react-query";

interface Response {
  error?: string;
  products: {
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
  }[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  searchQuery: string;
}

export const useSearchProducts = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["search", query],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/search?q=${encodeURIComponent(
          query,
        )}&page=${pageParam}`,
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
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.pagination.hasPrevPage
        ? firstPage.pagination.currentPage - 1
        : undefined,

    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });
};
