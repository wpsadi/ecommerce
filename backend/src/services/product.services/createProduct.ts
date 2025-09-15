import createHttpError from "http-errors";
import { v4 as uuidv4 } from "uuid";
import type { z } from "zod";
import { prisma } from "#config/prisma";
import type { productValidator } from "#validators/product.validations/productValidator";

export async function createProductService(
	data: z.infer<typeof productValidator.body> & {
		mainImage: string;
		sideImages: string[];
		video?: string;
	},
) {
	// Check if business exists
	const business = await prisma.business.findUnique({
		where: { id: data.businessId },
	});
	if (!business) throw createHttpError(404, "Business not found");
	const product = await prisma.product.create({
		data: {
			id: uuidv4(), // Generate a valid UUID string
			name: data.name,
			description: data.description,
			price: data.price,
			mainImage: data.mainImage,
			sideImages: data.sideImages,
			video: data.video,
			quantity: data.quantity,
			businessId: data.businessId,
		},
	});
	return product;
}
