import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { getPaymentStatusService } from "#services/payment.services/getPaymentStatus.ts";

export const getPaymentStatusController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { orderId } = req.params;
		if (!orderId) throw createHttpError.BadRequest("Order ID is required");

		// Only the owner of the order can check its payment status
		const result = await getPaymentStatusService(orderId, req.user?.id || "");

		return res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};
