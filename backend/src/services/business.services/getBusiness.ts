import createHttpError from "http-errors";
import { prisma } from "#config/prisma";

export const getBusinessService = async (businessId: string) => {
	const business = await prisma.business.findUnique({
		where: { id: businessId },
		include: {
			organization: true,
			BusinesPaymentInfo: true,
		},
	});
	if (!business) {
		throw createHttpError(404, "Business not found");
	}
	return business;
};
