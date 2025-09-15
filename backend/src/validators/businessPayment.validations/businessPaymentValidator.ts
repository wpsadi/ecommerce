import { z } from "zod";

export const businessPaymentValidator = {
	body: z.object({
		businessId: z.string({ error: "Business ID is required" }),
		upiId: z.string().optional(),
	}),
	params: z.object({
		businessId: z.string({ error: "Business ID is required" }),
	}),
};
