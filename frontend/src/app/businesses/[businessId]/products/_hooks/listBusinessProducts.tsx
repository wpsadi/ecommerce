import { useQuery } from "@tanstack/react-query";

interface Response {
  error?: string;
  mainImage: string | undefined;
  sideImages: string[];
  video: string | undefined;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  quantity: number;
  businessId: string;
  description: string | null;
  price: number;
}
[];
export const useBusinessProducts = (businessId: string) => {
  return useQuery({
    queryKey: ["business-products", businessId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/business/${businessId}`,
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
  });
};
