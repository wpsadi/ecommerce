import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { getProductsService } from "#services/product.services/getProducts";

export const getProductsController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { businessId } = req.params;
		if (!businessId)
			throw createHttpError.BadRequest("Business ID is required");
		const products = await getProductsService(businessId);
		res.json(products);
	} catch (err) {
		next(err);
	}
};
