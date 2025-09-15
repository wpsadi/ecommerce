import createHttpError from "http-errors";
import type { z } from "zod";
import { prisma } from "#config/prisma";
import type { updateBusinessValidator } from "#validators/business.validations/updateBusinessValidator";

export const updateBusinessService = async ({
	businessId,
	data,
}: {
	businessId: string;
	data: z.infer<typeof updateBusinessValidator.body>;
}) => {
	const business = await prisma.business.findUnique({
		where: { id: businessId },
	});
	if (!business) {
		throw createHttpError(404, "Business not found");
	}
	const updateData = { ...data };
	const updated = await prisma.business.update({
		where: { id: businessId },
		data: updateData,
	});
	return updated;
};
