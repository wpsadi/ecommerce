import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { getSingleOrderService } from "#services/order.services/getSingleOrder";
import { getSingleOrderValidator } from "#validators/order.validations/orderValidator";

export const getSingleOrderController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		// Check if user is authenticated
		if (!req.user) {
			throw createHttpError.Unauthorized("Please login to continue");
		}

		// Validate the order ID parameter
		const validation = getSingleOrderValidator.params.safeParse(req.params);
		if (!validation.success) {
			throw createHttpError(
				400,
				validation.error.issues[0]?.message || "Invalid order ID",
			);
		}

		const { orderId } = validation.data;

		// Get the order with ownership verification
		const order = await getSingleOrderService(orderId, req.user.id);

		res.status(200).json(order);
	} catch (err) {
		next(err);
	}
};
