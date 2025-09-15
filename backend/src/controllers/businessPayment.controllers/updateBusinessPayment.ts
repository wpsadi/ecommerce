import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { updateBusinessPaymentService } from "#services/businessPayment.services/updateBusinessPayment";
import { checkUserRole } from "#utils/betterauth";
import { businessPaymentValidator } from "#validators/businessPayment.validations/businessPaymentValidator";

export const updateBusinessPaymentController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const validation = businessPaymentValidator.body.parse(req.body);
		if (!req.user)
			throw createHttpError.Unauthorized("Please login to continue");
		// Only owner of business can update payment info
		const isOwner = await checkUserRole(
			req.user.id,
			validation.businessId,
			"OWNER",
			"business",
		);
		if (!isOwner)
			throw createHttpError.Forbidden("You must be an owner of this business");
		const updated = await updateBusinessPaymentService(validation);
		res.json(updated);
	} catch (err) {
		next(err);
	}
};
