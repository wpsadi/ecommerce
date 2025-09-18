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
		await verifyPaymentService(validation);

		return res.redirect(`${process.env.FRONTEND_URL}/orders`); // Redirect to success page with orderId
	} catch (error) {
		next(error);
	}
};
