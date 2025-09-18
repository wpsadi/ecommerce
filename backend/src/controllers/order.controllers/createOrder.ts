import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { createOrderService } from "#services/order.services/createOrder";
import { orderValidator } from "#validators/order.validations/orderValidator";

export const createOrderController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.user)
			throw createHttpError.Unauthorized("Please login to continue");
		const validation = orderValidator.body.parse(req.body);
		const order = await createOrderService(req.user.id, validation);
		res.status(201).json({
			...order,
			razorpayKeyId: process.env.RZP_KEY_ID,
		});
	} catch (err) {
		next(err);
	}
};
