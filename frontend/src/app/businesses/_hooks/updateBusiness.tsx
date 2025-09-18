import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const updateBusinessValidator = z.object(
  {
    businessType: z
      .enum(["INDIVIDUAL", "COMPANY"], { error: "Business type is required" })
      .optional(),
    name: z.string({ error: "Business name is required" }).optional(),
    address: z.string({ error: "Business address is required" }).optional(),
    phone: z.string({ error: "Business phone is required" }).optional(),
    description: z
      .string({ error: "Business description is required" })
      .optional(),
    email: z.string({ error: "Business email is required" }).optional(),
    website: z.string({ error: "Business website is required" }).optional(),
    organizationId: z
      .string({ error: "Organization ID is required" })
      .optional(),
  },
  {
    error: "At least one field is required",
  },
);

type Input = z.infer<typeof updateBusinessValidator>;

interface Response {
  error?: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string | null;
  name: string;
  organizationId: string;
  address: string | null;
  phone: string | null;
  description: string | null;
  businessType: Input["businessType"];
  website: string | null;
  isAllowed: boolean;
  isVerified: boolean;
}

export const useUpdateBusiness = () => {
  return useMutation({
    mutationFn: async (updateBusinessData: Input & { businessId: string }) => {
      const { businessId, ...dataToUpdate } = updateBusinessData;
      const validatedData = updateBusinessValidator.parse(dataToUpdate); // Validate input data
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/business/${businessId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validatedData),
          credentials: "include",
        },
      );
      const data = (await res.json()) as Response;
      if (data?.error) throw new Error(data.error);
      return data;
    },
  });
};
