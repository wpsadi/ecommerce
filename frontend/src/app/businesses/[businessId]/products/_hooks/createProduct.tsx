import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateProductResponse {
  error?: string; // Changed from MessageChannel to string
  businessId: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  mainImage: string;
  sideImages: string[];
  video: string | null;
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData): Promise<CreateProductResponse> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`,
        {
          method: "POST",
          credentials: "include",
          body: formData, // Send FormData directly (don't set Content-Type header)
        },
      );

      const data: CreateProductResponse = await res.json();

      if (data?.error) {
        throw new Error(data.error); // No need for optional chaining here
      }

      return data;
    },
    onSuccess: (_data, variables) => {
      // Extract businessId from FormData
      const businessId = variables.get("businessId") as string;

      // Invalidate business products query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["business-products", businessId],
      });
    },
  });
};
