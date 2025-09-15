import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { createBusinessService } from "#services/business.services/createBusiness";
import { checkUserRole } from "#utils/betterauth";
import { createBusinessValidator } from "#validators/business.validations/createBusinessValidator";

export const createBusinessController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const validation = createBusinessValidator.body.parse(req.body);

		const { organizationId, ...data } = validation;
		if (!req.user)
			throw createHttpError.Unauthorized("Please login to continue");
		// Check user is owner in organization
		const isOwner = await checkUserRole(req.user.id, organizationId, "OWNER");
		if (!isOwner)
			throw createHttpError.Forbidden(
				"You must be an owner in this organization",
			);
		const business = await createBusinessService({ organizationId, ...data });
		res.status(201).json(business);
	} catch (err) {
		next(err);
	}
};
