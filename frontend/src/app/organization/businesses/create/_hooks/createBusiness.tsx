import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const createBusinessValidator = z.object(
  {
    organizationId: z.string({ error: "Organization ID is required" }),
    name: z.string({ error: "Business name is required" }),
    businessType: z.enum(["INDIVIDUAL", "COMPANY"], {
      error: "Business type is required",
    }),
    address: z
      .string({
        error: "Address is required",
      })
      .optional(),
    phone: z
      .string({
        error: "Phone number is required",
      })
      .optional(),
    description: z
      .string({
        error: "Description is required",
      })
      .optional(),
    email: z
      .email({
        error: "Valid email is required",
      })
      .optional(),
    website: z
      .url({
        error: "Valid website URL is required",
      })
      .optional(),
  },
  {
    error: "All fields are required",
  },
);

type Input = z.infer<typeof createBusinessValidator>;

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

export const useCreateBusiness = () => {
  return useMutation({
    mutationFn: async (newBusinessData: Input) => {
      newBusinessData = createBusinessValidator.parse(newBusinessData); // Validate input data
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/business/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBusinessData),
          credentials: "include",
        },
      );

      const data = (await res.json()) as Response;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onError(error, _variables, _context) {
      console.error("Error creating business:", error);
    },
  });
};
