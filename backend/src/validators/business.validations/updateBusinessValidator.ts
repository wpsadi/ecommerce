import { z } from "zod";

export const updateBusinessValidator = {
	body: z.object({
		name: z.string().optional(),
		address: z.string().optional(),
		phone: z.string().optional(),
		description: z.string().optional(),
		businessType: z.enum(["INDIVIDUAL", "COMPANY"], {
			error: "Invalid business type",
		}),
		email: z.string().email().optional(),
		website: z.string().url().optional(),
		// isAllowed: z.boolean().optional(),
		// isVerified: z.boolean().optional(),
		organizationId: z.string().optional(),
	}),
	params: z.object({
		businessId: z.string({ error: "Business ID is required" }),
	}),
};
