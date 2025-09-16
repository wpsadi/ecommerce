import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

// Define the expected type for the response
export const useOrganization = () => {
  return useQuery({
    queryKey: ["organization"],
    queryFn: async () => {
      const res = await authClient.organization.getFullOrganization();

      if (!res?.data) throw new Error("You are not part of any organization");

      return res.data;
    },
  });
};
