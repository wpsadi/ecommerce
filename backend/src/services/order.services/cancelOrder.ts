import createHttpError from "http-errors";
import { prisma } from "#config/prisma";

export async function cancelOrderService(orderId: string, userId: string) {
	const order = await prisma.order.findUnique({ where: { id: orderId } });
	if (!order) throw createHttpError(404, "Order not found");
	if (order.userId !== userId)
		throw createHttpError(403, "Not authorized to cancel this order");
	if (order.status !== "CREATED" && order.status !== "PENDING") {
		throw createHttpError(
			400,
			"Only pending or created orders can be cancelled",
		);
	}
	const updated = await prisma.order.update({
		where: { id: orderId },
		data: { status: "CANCELLED" },
	});
	return updated;
}
