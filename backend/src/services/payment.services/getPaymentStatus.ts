import createHttpError from "http-errors";
import { prisma } from "#config/prisma";
import { rzp } from "#config/rzp";

export async function getPaymentStatusService(orderId: string, userId: string) {
	// Find the order in our database
	const order = await prisma.order.findUnique({
		where: { id: orderId },
	});

	if (!order) {
		throw createHttpError(404, "Order not found");
	}

	// Security check: ensure the user requesting the status is the owner of the order
	if (order.userId !== userId) {
		throw createHttpError(403, "You are not authorized to access this order");
	}

	// If we don't have a Razorpay order ID, the payment was never initiated
	if (!order.razorpayOrderId) {
		return {
			orderId: order.id,
			status: order.status,
			paymentInitiated: false,
			message: "Payment not initiated",
		};
	}

	try {
		// Get the latest payment status from Razorpay
		const rzpOrder = await rzp.orders.fetch(order.razorpayOrderId);

		// Map Razorpay status to our system status
		const paymentInfo = {
			orderId: order.id,
			razorpayOrderId: order.razorpayOrderId,
			razorpayPaymentId: order.razorpayPaymentId,
			status: order.status,
			amount: Number(rzpOrder.amount) / 100, // Convert from paisa/cents to main currency
			amountPaid: Number(rzpOrder.amount_paid) / 100,
			currency: rzpOrder.currency,
			receipt: rzpOrder.receipt,
			paymentInitiated: true,
			rzpStatus: rzpOrder.status,
			created_at: new Date(rzpOrder.created_at * 1000).toISOString(),
		};

		return paymentInfo;
	} catch (error) {
		console.error("Error fetching payment status:", error);

		// If we can't reach Razorpay, return what we know from our database
		return {
			orderId: order.id,
			status: order.status,
			razorpayOrderId: order.razorpayOrderId,
			razorpayPaymentId: order.razorpayPaymentId,
			paymentInitiated: true,
			error: "Could not fetch the latest payment status from gateway",
		};
	}
}
