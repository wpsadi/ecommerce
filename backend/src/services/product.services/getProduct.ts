import createHttpError from "http-errors";
import { prisma } from "#config/prisma";
import { getSignedUrl } from "#config/s3";

export async function getProductService(productId: string) {
	const product = await prisma.product.findUnique({ where: { id: productId } });
	if (!product) throw createHttpError(404, "Product not found");
	return {
		...product,
		mainImage: product.mainImage ? getSignedUrl(product.mainImage) : undefined,
		sideImages: Array.isArray(product.sideImages)
			? product.sideImages.map((key) => getSignedUrl(key))
			: [],
		video: product.video ? getSignedUrl(product.video) : undefined,
	};
}
