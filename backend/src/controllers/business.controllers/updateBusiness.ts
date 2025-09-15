import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { updateBusinessService } from "#services/business.services/updateBusiness";
import { checkUserRole } from "#utils/betterauth";
import { updateBusinessValidator } from "#validators/business.validations/updateBusinessValidator";
export const updateBusinessController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { businessId } = updateBusinessValidator.params.parse(req.params);
		const validation = updateBusinessValidator.body.parse(req.body);

		if (!req.user)
			throw createHttpError.Unauthorized("Please login to continue");
		// Check user is owner in business's organization
		const isOwner = await checkUserRole(
			req.user.id,
			req.body.organizationId,
			"OWNER",
		);
		if (!isOwner)
			throw createHttpError.Forbidden(
				"You must be an owner in this organization",
			);
		const updated = await updateBusinessService({
			businessId,
			data: validation,
		});
		res.json(updated);
	} catch (err) {
		next(err);
	}
};
