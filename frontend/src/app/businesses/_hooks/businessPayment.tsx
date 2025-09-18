import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type BusinessPaymentInput,
  type BusinessPaymentResponse,
  businessPaymentSchema,
} from "../_types/businessPayment.types";

// Hook to get business payment info
export const useGetBusinessPayment = (businessId: string) => {
  return useQuery({
    queryKey: ["businessPayment", businessId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/business/${businessId}/payment`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = (await res.json()) as BusinessPaymentResponse;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    enabled: !!businessId,
  });
};

// Hook to create business payment
export const useCreateBusinessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentData: BusinessPaymentInput) => {
      // Validate the input
      businessPaymentSchema.parse(paymentData);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/business/${paymentData.businessId}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
          credentials: "include",
        },
      );

      const data = (await res.json()) as BusinessPaymentResponse;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate the query to refetch the payment info
      queryClient.invalidateQueries({
        queryKey: ["businessPayment", data.businessId],
      });
      // Also invalidate business queries that might display payment status
      queryClient.invalidateQueries({ queryKey: ["my-businesses"] });
    },
    onError(error) {
      console.error("Error creating business payment:", error);
    },
  });
};

// Hook to update business payment
export const useUpdateBusinessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentData: BusinessPaymentInput) => {
      // Validate the input
      businessPaymentSchema.parse(paymentData);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/business/${paymentData.businessId}/payment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
          credentials: "include",
        },
      );

      const data = (await res.json()) as BusinessPaymentResponse;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate the query to refetch the payment info
      queryClient.invalidateQueries({
        queryKey: ["businessPayment", data.businessId],
      });
      // Also invalidate business queries that might display payment status
      queryClient.invalidateQueries({ queryKey: ["my-businesses"] });
    },
    onError(error) {
      console.error("Error updating business payment:", error);
    },
  });
};

// Hook to delete business payment
export const useDeleteBusinessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (businessId: string) => {
      if (!businessId) throw new Error("Business ID is required");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/business/${businessId}/payment`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await res.json();
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (_, businessId) => {
      // Invalidate the query to refetch the payment info
      queryClient.invalidateQueries({
        queryKey: ["businessPayment", businessId],
      });
      // Also invalidate business queries that might display payment status
      queryClient.invalidateQueries({ queryKey: ["my-businesses"] });
    },
    onError(error) {
      console.error("Error deleting business payment:", error);
    },
  });
};
