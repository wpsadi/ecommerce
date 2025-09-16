import { useInfiniteQuery } from "@tanstack/react-query";

interface Response {
  error?: string;
  businesses: {
    id: string;
    email: string | null;
    name: string;
    organizationId: string;
    address: string | null;
    phone: string | null;
    description: string | null;
    businessType: string;
    website: string | null;
    isAllowed: boolean;
    isVerified: boolean;
  }[];
  message: string;
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}
export const useMyBusiness = () => {
  return useInfiniteQuery({
    queryKey: ["my-businesses"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/business/list?page=${pageParam}`,
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
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.pagination.hasMore && firstPage.pagination.page > 1
        ? firstPage.pagination.page - 1
        : undefined;
    },
    initialPageParam: 1,
  });
};
