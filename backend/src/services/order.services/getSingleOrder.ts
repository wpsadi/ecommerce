import createHttpError from "http-errors";
import { prisma } from "#config/prisma";
import { getSignedUrl } from "#config/s3";

export async function getSingleOrderService(orderId: string, userId: string) {
	// Find the order and ensure it belongs to the current user
	const order = await prisma.order.findFirst({
		where: {
			id: orderId,
			userId: userId, // Ensure ownership
		},
		include: {
			items: {
				include: {
					product: {
						include: {
							business: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
				},
			},
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
	});

	if (!order) {
		throw createHttpError.NotFound(
			"Order not found or you don't have permission to access it",
		);
	}

	// Attach signed URLs for product images
	const orderWithSignedUrls = {
		...order,
		items: order.items.map((item) => ({
			...item,
			product: {
				...item.product,
				mainImage: item.product.mainImage
					? getSignedUrl(item.product.mainImage)
					: undefined,
				sideImages: Array.isArray(item.product.sideImages)
					? item.product.sideImages.map((key) => getSignedUrl(key))
					: [],
				video: item.product.video
					? getSignedUrl(item.product.video)
					: undefined,
			},
		})),
	};

	return orderWithSignedUrls;
}
