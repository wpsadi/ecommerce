import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { listProductsService } from "#services/product.services/listProducts";
import { listProductsValidator } from "#validators/product.validations/productValidator";

export const listProductsController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		// Validate query parameters
		const validation = listProductsValidator.query.safeParse(req.query);
		if (!validation.success) {
			throw createHttpError(
				400,
				validation.error.issues[0]?.message || "Invalid query parameters",
			);
		}

		// Call service to get products with pagination
		const result = await listProductsService(validation.data);

		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};
