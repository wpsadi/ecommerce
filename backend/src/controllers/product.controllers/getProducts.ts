import type { NextFunction, Request, Response } from "express";
import { getProductsService } from "#services/product.services/getProducts";

export const getProductsController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { businessId } = req.params;
		const products = await getProductsService(businessId);
		res.json(products);
	} catch (err) {
		next(err);
	}
};
