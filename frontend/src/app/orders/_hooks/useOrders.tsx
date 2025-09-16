import { useInfiniteQuery } from "@tanstack/react-query";

interface Response {
  error?: string;
  orders: ({
    items: {
      id: string;
      orderId: string;
      productId: string;
      quantity: number;
      price: number;
    }[];
  } & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    userId: string;
    totalAmount: number;
    razorpayOrderId: string | null;
    razorpayPaymentId: string | null;
    razorpaySignature: string | null;
  })[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
export const useOrders = () => {
  return useInfiniteQuery({
    queryKey: ["orders"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders?page=${pageParam}`,
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
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });
};
