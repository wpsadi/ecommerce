import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { getProductService } from "#services/product.services/getProduct";

export const getProductController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { productId } = req.params;
		if (!productId) throw createHttpError(400, "Product ID is required");
		const product = await getProductService(productId);
		res.json(product);
	} catch (err) {
		next(err);
	}
};
