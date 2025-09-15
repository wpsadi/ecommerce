import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { getBusinessService } from "#services/business.services/getBusiness";
export const getBusinessController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { businessId } = req.params;
		if (!businessId) throw createHttpError(400, "Business ID is required");
		const business = await getBusinessService(businessId);
		res.json(business);
	} catch (err) {
		next(err);
	}
};
