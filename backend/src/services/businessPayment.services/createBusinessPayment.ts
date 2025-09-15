import createHttpError from "http-errors";
import { v4 as uuidv4 } from "uuid"; // Import UUID library
import type { z } from "zod";
import { prisma } from "#config/prisma";
import type { businessPaymentValidator } from "#validators/businessPayment.validations/businessPaymentValidator";

export async function createBusinessPaymentService(
	data: z.infer<typeof businessPaymentValidator.body>,
) {
	// Check if business exists
	const business = await prisma.business.findUnique({
		where: { id: data.businessId },
	});
	if (!business) throw createHttpError(404, "Business not found");
	// Only one payment info per business
	const existing = await prisma.businesPaymentInfo.findUnique({
		where: { businessId: data.businessId },
	});
	if (existing)
		throw createHttpError(409, "Payment info already exists for this business");
	const payment = await prisma.businesPaymentInfo.create({
		data: {
			id: uuidv4(), // Generate a unique ID
			businessId: data.businessId,
			upiId: data.upiId,
		},
	});
	return payment;
}
