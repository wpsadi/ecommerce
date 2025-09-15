import type { NextFunction, Request, Response } from "express";
import { verifyPaymentService } from "#services/payment.services/verifyPayment";
import { razorpayCallbackValidator } from "#validators/payment.validations/razorpayCallbackValidator";

export const verifyPaymentController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const validation = razorpayCallbackValidator.body.parse(req.body);
		const result = await verifyPaymentService(validation);

		return res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};
