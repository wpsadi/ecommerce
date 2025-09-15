import { z } from "zod";

export const orderValidator = {
	body: z.object({
		items: z
			.array(
				z.object({
					productId: z.string(),
					quantity: z.number().int().positive(),
				}),
			)
			.min(1, "At least one product is required"),
	}),
};

export const getSingleOrderValidator = {
	params: z.object({
		orderId: z.string().min(1, "Order ID is required"),
	}),
};

export type OrderInput = z.infer<typeof orderValidator.body>;
export type GetSingleOrderParams = z.infer<
	typeof getSingleOrderValidator.params
>;
