import type { Prisma } from "#/generated/prisma";
import { prisma } from "#config/prisma";
import { getSignedUrl } from "#config/s3";
import type { ListProductsQuery } from "#validators/product.validations/productValidator";

export async function listProductsService(query: ListProductsQuery) {
	const { page, limit, businessId } = query;
	const skip = (page - 1) * limit;

	// Build the where clause
	const whereClause: Prisma.ProductWhereInput = {};
	if (businessId) {
		whereClause.businessId = businessId;
	}

	// Get total count for pagination metadata
	const totalCount = await prisma.product.count({ where: whereClause });

	// Get the products with pagination
	const products = await prisma.product.findMany({
		where: whereClause,
		orderBy: { createdAt: "desc" },
		skip,
		take: limit,
		include: {
			business: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	// Attach signed URLs for images/videos
	const productsWithSignedUrls = products.map((product) => ({
		...product,
		mainImage: product.mainImage ? getSignedUrl(product.mainImage) : undefined,
		sideImages: Array.isArray(product.sideImages)
			? product.sideImages.map((key) => getSignedUrl(key))
			: [],
		video: product.video ? getSignedUrl(product.video) : undefined,
	}));

	// Calculate pagination metadata
	const totalPages = Math.ceil(totalCount / limit);
	const hasNextPage = page < totalPages;
	const hasPrevPage = page > 1;

	return {
		products: productsWithSignedUrls,
		pagination: {
			currentPage: page,
			totalPages,
			totalCount,
			limit,
			hasNextPage,
			hasPrevPage,
		},
	};
}
