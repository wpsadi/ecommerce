import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateProductResponse {
  error?: string;
  message?: string;
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      formData,
    }: {
      productId: string;
      formData: FormData;
    }): Promise<UpdateProductResponse> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${productId}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData, // Send FormData directly
        },
      );

      const data: UpdateProductResponse = await res.json();

      if (data?.error) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate specific product query
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });

      // Invalidate business products query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["business-products"],
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string): Promise<UpdateProductResponse> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data: UpdateProductResponse = await res.json();

      if (data?.error) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate business products query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["business-products"],
      });
    },
  });
};
