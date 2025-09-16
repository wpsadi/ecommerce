import type { NextFunction, Request, Response } from "express";
import { listProductsService } from "#services/product.services/listProducts";
import { listProductsValidator } from "#validators/product.validations/productValidator";

export const listProductsController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		// Validate query parameters
		const validation = listProductsValidator.query.parse(req.query);

		// Call service to get products with pagination
		const result = await listProductsService(validation);

		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};
