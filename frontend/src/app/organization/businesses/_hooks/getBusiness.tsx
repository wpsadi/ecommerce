import { useQuery } from "@tanstack/react-query";
import type z from "zod";
import type { createBusinessValidator } from "../create/_hooks/createBusiness";

interface Response {
  error?: string;
  organization: {
    id: string;
    createdAt: Date;
    name: string;
    slug: string | null;
    logo: string | null;
    metadata: string | null;
  };
  BusinesPaymentInfo: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    businessId: string;
    upiId: string | null;
  } | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string | null;
  name: string;
  organizationId: string;
  address: string | null;
  phone: string | null;
  description: string | null;
  businessType: z.infer<typeof createBusinessValidator>["businessType"];
  website: string | null;
  isAllowed: boolean;
  isVerified: boolean;
}
export const useGetBusiness = (businessId: string) => {
  return useQuery({
    queryKey: ["business", businessId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/business/${businessId}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );
      const data = (await res.json()) as Response;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    enabled: !!businessId, // Only run the query if businessId is provided
  });
};
