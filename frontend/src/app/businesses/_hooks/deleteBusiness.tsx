import { useMutation } from "@tanstack/react-query";

interface Response {
  error?: string;
  message: string;
}

export const useDeleteBusiness = () => {
  return useMutation({
    mutationFn: async (businessId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/business/${businessId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const data: Response = await res.json();
      if (data?.error) throw new Error(data.error);
      return data;
    },
  });
};
