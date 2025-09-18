import { useQuery } from "@tanstack/react-query";

interface ProductResponse {
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

export const useGetProduct = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async (): Promise<ProductResponse> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${productId}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      const data: ProductResponse = await res.json();
      if (data?.error) throw new Error(data.error);
      return data;
    },
    enabled: !!productId,
  });
};
