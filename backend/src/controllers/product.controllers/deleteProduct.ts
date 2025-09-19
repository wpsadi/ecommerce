import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { deleteProductService } from "#services/product.services/deleteProduct";
import { checkUserRole } from "#utils/betterauth";

export const deleteProductController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { productId } = req.params;
		if (!req.user)
			throw createHttpError.Unauthorized("Please login to continue");

		// Validate businessId
		const businessId = req.body?.businessId;
		if (!businessId || typeof businessId !== "string") {
			throw createHttpError.BadRequest(
				"Business ID is required to delete a product",
			);
		}
		if (!productId || typeof productId !== "string") {
			throw createHttpError.BadRequest(
				"Product ID is required to delete a product",
			);
		}

		// Only owner of business can delete product
		const isOwner = await checkUserRole(
			req.user.id,
			businessId,
			"owner",
			"business",
		);
		if (!isOwner)
			throw createHttpError.Forbidden("You must be an owner of this business");

		const result = await deleteProductService(productId);
		res.json(result);
	} catch (err) {
		next(err);
	}
};
