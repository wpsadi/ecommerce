import createHttpError from "http-errors";
import type { z } from "zod";
import { prisma } from "#config/prisma";
import type { productValidator } from "#validators/product.validations/productValidator";

export async function updateProductService(
	productId: string,
	data: Partial<z.infer<typeof productValidator.body>> & {
		mainImage?: string;
		sideImages?: string[];
		video?: string;
	},
) {
	const product = await prisma.product.findUnique({ where: { id: productId } });
	if (!product) throw createHttpError(404, "Product not found");
	const updated = await prisma.product.update({
		where: { id: productId },
		data: {
			...data,
		},
	});
	return updated;
}
