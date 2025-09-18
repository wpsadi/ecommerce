import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { searchProductsService } from "#services/product.services/searchProducts";
import { searchProductsValidator } from "#validators/product.validations/productValidator";

export const searchProductsController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		// Validate query parameters
		if (!req.query.q) {
			res.json({
				products: [],
				pagination: {
					currentPage: 1,
					totalPages: 0,
					totalCount: 0,
					limit: 20,
					hasNextPage: false,
					hasPrevPage: false,
				},
				searchQuery: "",
			});
		}
		const validation = searchProductsValidator.query.safeParse(req.query);
		if (!validation.success) {
			throw createHttpError(
				400,
				validation.error.issues[0]?.message || "Invalid query parameters",
			);
		}

		// Call service to search products with pagination
		const result = await searchProductsService(validation.data);

		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};
