import crypto from "node:crypto";
import createHttpError from "http-errors";
import { prisma } from "#config/prisma";
import type { RazorpayCallbackInput } from "#validators/payment.validations/razorpayCallbackValidator";

export async function verifyPaymentService(data: RazorpayCallbackInput) {
	const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

	// Verify signature
	const generatedSignature = crypto
		.createHmac("sha256", process.env.RZP_SECRET)
		.update(`${razorpay_order_id}|${razorpay_payment_id}`)
		.digest("hex");

	if (generatedSignature !== razorpay_signature) {
		throw createHttpError(400, "Invalid payment signature");
	}

	try {
		// Find the order in our database
		const order = await prisma.order.findFirst({
			where: { razorpayOrderId: razorpay_order_id },
		});

		if (!order) {
			throw createHttpError(404, "Order not found");
		}

		// Update order status
		const _updatedOrder = await prisma.order.update({
			where: { id: order.id },
			data: {
				status: "PAID",
				razorpayPaymentId: razorpay_payment_id,
				razorpaySignature: razorpay_signature,
			},
		});

		// Optional: You might want to update product inventory here
		for (const item of await prisma.orderItem.findMany({
			where: { orderId: order.id },
		})) {
			await prisma.product.update({
				where: { id: item.productId },
				data: {
					quantity: {
						decrement: item.quantity,
					},
				},
			});
		}

		return {
			orderId: order.id,
			status: "PAID",
			message: "Payment successful",
		};
	} catch (error) {
		// If there's an error, we should log it and handle accordingly
		console.error("Payment verification error:", error);

		// If the error is our HTTP error, rethrow it
		if (error instanceof createHttpError.HttpError) {
			throw error;
		}

		// Otherwise throw a generic error
		throw createHttpError(500, "Failed to process payment verification");
	}
}
