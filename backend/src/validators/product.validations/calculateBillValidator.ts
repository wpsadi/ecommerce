import { z } from "zod";

export const calculateBillValidator = z.object({
	items: z.array(
		z.object({
			productId: z.string(),
			quantity: z.number().int().min(1),
		}),
	),
});

export type CalculateBillInput = z.infer<typeof calculateBillValidator>;
