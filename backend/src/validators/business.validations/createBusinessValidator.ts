import { z } from "zod";

export const createBusinessValidator = {
	body: z.object({
		organizationId: z.string({ error: "Organization ID is required" }),
		name: z.string({ error: "Business name is required" }),
		address: z.string().optional(),
		phone: z.string().optional(),
		description: z.string().optional(),
		businessType: z.enum(["INDIVIDUAL", "COMPANY"], {
			error: "Business type is required",
		}),
		email: z
			.email({
				error: "Invalid email address",
			})
			.optional(),
		website: z
			.url({
				error: "Invalid website URL",
			})
			.optional(),
	}),
};
