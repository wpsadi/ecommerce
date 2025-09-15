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

// Pagination and search validators
export const listProductsValidator = {
	query: z.object({
		page: z.coerce.number().min(1).default(1),
		limit: z.coerce.number().min(1).max(100).default(10),
		businessId: z.string().optional(),
	}),
};

export const searchProductsValidator = {
	query: z.object({
		q: z.string().min(1, "Search query is required"),
		page: z.coerce.number().min(1).default(1),
		limit: z.coerce.number().min(1).max(100).default(10),
		businessId: z.string().optional(),
	}),
};

// Example type exports:
export type ProductInput = z.infer<typeof productValidator.body>;
export type ListProductsQuery = z.infer<typeof listProductsValidator.query>;
export type SearchProductsQuery = z.infer<typeof searchProductsValidator.query>;
