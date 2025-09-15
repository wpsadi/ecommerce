import createHttpError from "http-errors";
import type { z } from "zod";
import { prisma } from "#config/prisma";
import type { businessPaymentValidator } from "#validators/businessPayment.validations/businessPaymentValidator";

export async function updateBusinessPaymentService({
	businessId,
	upiId,
}: z.infer<typeof businessPaymentValidator.body>) {
	const payment = await prisma.businesPaymentInfo.findUnique({
		where: { businessId },
	});
	if (!payment) throw createHttpError(404, "Business payment info not found");
	const updated = await prisma.businesPaymentInfo.update({
		where: { businessId },
		data: { upiId },
	});
	return updated;
}
