import createHttpError from "http-errors";
import { prisma } from "#config/prisma";

export async function deleteBusinessPaymentService(businessId: string) {
	const payment = await prisma.businesPaymentInfo.findUnique({
		where: { businessId },
	});
	if (!payment) throw createHttpError(404, "Business payment info not found");
	await prisma.businesPaymentInfo.delete({ where: { businessId } });
	return { message: "Business payment info deleted successfully" };
}
