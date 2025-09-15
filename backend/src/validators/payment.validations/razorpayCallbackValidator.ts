import { z } from "zod";

export const razorpayCallbackValidator = {
	body: z.object({
		razorpay_order_id: z.string(),
		razorpay_payment_id: z.string(),
		razorpay_signature: z.string(),
	}),
};

export type RazorpayCallbackInput = z.infer<
	typeof razorpayCallbackValidator.body
>;
