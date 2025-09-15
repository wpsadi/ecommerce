import createHttpError from "http-errors";
import { v4 as uuidv4 } from "uuid"; // Import UUID library
import { prisma } from "#config/prisma";
import { rzp } from "#config/rzp";
import type { OrderInput } from "#validators/order.validations/orderValidator";

export async function createOrderService(userId: string, data: OrderInput) {
	// Validate products and calculate total
	let totalAmount = 0;
	const items: Array<{
		id: string;
		productId: string;
		quantity: number;
		price: number;
		product: { connect: { id: string } };
	}> = await Promise.all(
		data.items.map(async (item: { productId: string; quantity: number }) => {
			const { productId, quantity } = item;
			const product = await prisma.product.findUnique({
				where: { id: productId },
			});
			if (!product)
				throw createHttpError(404, `Product not found: ${productId}`);
			if (product.quantity < quantity)
				throw createHttpError(
					400,
					`Insufficient stock for product: ${product.name}`,
				);
			totalAmount += product.price * quantity;
			return {
				id: uuidv4(), // Generate a unique ID for each item
				productId,
				quantity,
				price: product.price,
				product: { connect: { id: productId } },
			};
		}),
	);

	// Create order and order items
	const order = await prisma.order.create({
		data: {
			id: uuidv4(), // Generate a unique ID for the order
			userId,
			totalAmount,
			status: "CREATED",
			items: {
				create: items,
			},
		},
		include: { items: true },
	});

	// Create Razorpay order
	try {
		const rzpOrder = await rzp.orders.create({
			amount: Math.round(totalAmount * 100), // Convert to paisa/cents (Razorpay uses smallest currency unit)
			currency: "INR", // Change as needed based on your configuration
			receipt: order.id,
			notes: {
				orderId: order.id,
				userId,
			},
		});

		// Update our order with Razorpay orderId
		await prisma.order.update({
			where: { id: order.id },
			data: {
				razorpayOrderId: rzpOrder.id,
				status: "PENDING",
			},
		});

		// Return the updated order with payment information
		return {
			...order,
			razorpayOrderId: rzpOrder.id,
			status: "PENDING",
			paymentInfo: {
				orderId: rzpOrder.id,
				amount: Number(rzpOrder.amount) / 100, // Convert back to main currency unit for display
				currency: rzpOrder.currency,
				// Include the key_id so frontend can initialize the payment
				key_id: process.env.RZP_KEY_ID,
			},
		};
	} catch (error) {
		console.error("Razorpay order creation failed:", error);

		// If Razorpay integration fails, mark order as PAYMENT_FAILED
		await prisma.order.update({
			where: { id: order.id },
			data: { status: "PAYMENT_FAILED" },
		});

		// Return the order with failure status
		return {
			...order,
			status: "PAYMENT_FAILED",
			error: "Payment gateway error. Please try again later.",
		};
	}
}
