import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { getOrdersService } from "#services/order.services/getOrders";

export const getOrdersController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.user)
			throw createHttpError.Unauthorized("Please login to continue");
		const { status, page = 1, pageSize = 10 } = req.query;
		const result = await getOrdersService({
			userId: req.user.id,
			status: typeof status === "string" ? status : undefined,
			page: Number(page),
			pageSize: Number(pageSize),
		});
		res.json(result);
	} catch (err) {
		next(err);
	}
};
