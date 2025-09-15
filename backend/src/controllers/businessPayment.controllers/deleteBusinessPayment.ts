import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { deleteBusinessPaymentService } from "#services/businessPayment.services/deleteBusinessPayment";
import { checkUserRole } from "#utils/betterauth";

export const deleteBusinessPaymentController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { businessId } = req.params;
		if (!businessId) throw createHttpError(400, "Business ID is required");
		if (!req.user)
			throw createHttpError.Unauthorized("Please login to continue");
		// Only owner of business can delete payment info
		const isOwner = await checkUserRole(
			req.user.id,
			businessId,
			"OWNER",
			"business",
		);
		if (!isOwner)
			throw createHttpError.Forbidden("You must be an owner of this business");
		const result = await deleteBusinessPaymentService(businessId);
		res.json(result);
	} catch (err) {
		next(err);
	}
};
