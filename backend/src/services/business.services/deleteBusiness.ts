import createHttpError from "http-errors";
import { prisma } from "#config/prisma";

export const deleteBusinessService = async (businessId: string) => {
	const business = await prisma.business.findUnique({
		where: { id: businessId },
	});
	if (!business) {
		throw createHttpError(404, "Business not found");
	}
	await prisma.business.delete({ where: { id: businessId } });
	return { message: "Business deleted successfully" };
};
