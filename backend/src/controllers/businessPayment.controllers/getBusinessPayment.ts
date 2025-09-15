import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { getBusinessPaymentService } from "#services/businessPayment.services/getBusinessPayment";

export const getBusinessPaymentController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { businessId } = req.params;
		if (!businessId) throw createHttpError(400, "Business ID is required");
		const payment = await getBusinessPaymentService(businessId);
		res.json(payment);
	} catch (err) {
		next(err);
	}
};
