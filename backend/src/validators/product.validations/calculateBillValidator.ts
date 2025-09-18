import { z } from "zod";

export const calculateBillValidator = z.object(
	{
		items: z.array(
			z.object(
				{
					productId: z.string({
						error: "Product ID is required",
					}),
					quantity: z.coerce
						.number({
							error: "Quantity is required",
						})
						.int({
							error: "Quantity must be an integer",
						})
						.min(1, {
							error: "Quantity must be at least 1",
						}),
				},
				{
					error: "Invalid item data",
				},
			),
		),
	},
	{
		error: "Invalid input data",
	},
);

export type CalculateBillInput = z.infer<typeof calculateBillValidator>;
