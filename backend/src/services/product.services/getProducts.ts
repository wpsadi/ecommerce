import { prisma } from "#config/prisma";
import { getSignedUrl } from "#config/s3";

export async function getProductsService(businessId: string) {
	// List all products for a business
	const products = await prisma.product.findMany({
		where: { businessId },
		orderBy: { createdAt: "desc" },
	});
	// Attach signed URLs for images/videos
	return products.map((product) => ({
		...product,
		mainImage: product.mainImage ? getSignedUrl(product.mainImage) : undefined,
		sideImages: Array.isArray(product.sideImages)
			? product.sideImages.map((key) => getSignedUrl(key))
			: [],
		video: product.video ? getSignedUrl(product.video) : undefined,
	}));
}
