import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { cancelOrderService } from "#services/order.services/cancelOrder";

export const cancelOrderController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.user)
			throw createHttpError.Unauthorized("Please login to continue");
		const { orderId } = req.params;
		if (!orderId || typeof orderId !== "string") {
			throw createHttpError.BadRequest("Order ID is required");
		}
		const result = await cancelOrderService(orderId, req.user.id);
		res.json(result);
	} catch (err) {
		next(err);
	}
};
