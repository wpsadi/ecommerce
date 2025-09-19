import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { getProductService } from "#services/product.services/getProduct";

export const getProductController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { productId } = req.params;
		if (!productId) throw createHttpError(400, "Product ID is required");
		const product = await getProductService(productId);
		// Define an extended type to include the videoUrl property
		type ProductWithVideoUrl = typeof product & { videoUrl?: string };

		// Add full URL for video if present
		let result: typeof product | ProductWithVideoUrl = product;
		if (product?.video && typeof product.video === "string") {
			const baseUrl =
				process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;
			result = {
				...product,
				videoUrl: product.video.startsWith("http")
					? product.video
					: `${baseUrl}/${product.video}`,
			};
		}
		res.json(result);
	} catch (err) {
		next(err);
	}
};
