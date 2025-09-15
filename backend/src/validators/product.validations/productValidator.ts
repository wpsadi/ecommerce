import { z } from "zod";

// After validation, if you want a type, use:
//   export type ProductInput = z.infer<typeof productValidator.body>;

export const productValidator = {
	body: z.object({
		businessId: z.string({ error: "Business ID is required" }),
		name: z.string({ error: "Product name is required" }),
		description: z.string().optional(),
		price: z.number({ error: "Price is required" }),
		quantity: z.number({ error: "Quantity is required" }),
		// mainImage, sideImages, video handled by file upload
	}),
	params: z.object({
		productId: z.string({ error: "Product ID is required" }),
		businessId: z.string({ error: "Business ID is required" }),
	}),
};

// Example type export:
export type ProductInput = z.infer<typeof productValidator.body>;
