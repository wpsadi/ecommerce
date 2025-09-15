import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { deleteBusinessService } from "#services/business.services/deleteBusiness";
import { checkUserRole } from "#utils/betterauth";

export const deleteBusinessController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { businessId } = req.params;
		if (!businessId) throw createHttpError(400, "Business ID is required");
		if (!req.user)
			throw createHttpError.Unauthorized("Please login to continue");
		// Check user is owner in business's organization
		const isOwner = await checkUserRole(
			req.user.id,
			businessId,
			"OWNER",
			"business",
		);
		if (!isOwner)
			throw createHttpError.Forbidden("You must be an owner of this business");
		const result = await deleteBusinessService(businessId);
		res.json(result);
	} catch (err) {
		next(err);
	}
};
