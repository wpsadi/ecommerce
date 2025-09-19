import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { s3 } from "#config/s3";

import { updateProductService } from "#services/product.services/updateProduct";
import { checkUserRole } from "#utils/betterauth";
import type { ProductInput } from "#validators/product.validations/productValidator";

export const updateProductController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		console.log(1);
		const { productId } = req.params;
		if (!productId || typeof productId !== "string") {
			throw createHttpError.BadRequest(
				"Product ID is required to update a product",
			);
		}
		if (!req.user)
			throw createHttpError.Unauthorized("Please login to continue");

		// Validate businessId
		const businessId = req.body?.businessId;
		if (!businessId || typeof businessId !== "string") {
			throw createHttpError.BadRequest(
				"Business ID is required to update a product",
			);
		}

		// Only owner of business can update product
		const isOwner = await checkUserRole(
			req.user.id,
			businessId,
			"owner",
			"business",
		);
		if (!isOwner)
			throw createHttpError.Forbidden("You must be an owner of this business");

		console.log(2);
		// File upload logic for mainImage, sideImages, video (optional)
		const files = req.files as Record<
			string,
			Express.Multer.File[] | undefined
		>;
		let mainImageUrl: string | undefined;
		let sideImageUrls: string[] | undefined;
		let videoUrl: string | undefined;

		// S3 path: /business/{businessId}/product/{productId}/images or /video
		if (Array.isArray(files?.mainImage) && files.mainImage[0]) {
			const file = files.mainImage[0];
			if (file?.originalname && file.buffer) {
				const ext = file.originalname.split(".").pop();
				const key = `business/${businessId}/product/${productId}/mainImage.${ext}`;
				console.log(key);
				const result = await s3.write(key, file.buffer).catch((e) => {
					console.error(e);
				});
				console.log(result);
				if (!result) throw createHttpError(500, "Failed to upload main image");
				mainImageUrl = key;
			}
		} else {
			// Retain existing main image if no new one is uploaded
			const existingMainImage = req.body.existingMainImage;
			if (existingMainImage && typeof existingMainImage === "string") {
				mainImageUrl = existingMainImage;
			}
		}
		console.log(3);

		if (Array.isArray(files?.sideImages) && files.sideImages.length > 0) {
			sideImageUrls = [];
			for (let i = 0; i < files.sideImages.length; i++) {
				const file = files.sideImages[i];
				if (file?.originalname && file.buffer) {
					const ext = file.originalname.split(".").pop();
					const key = `business/${businessId}/product/${productId}/sideImage${i + 1}.${ext}`;
					const result = await s3.write(key, file.buffer);
					if (!result)
						throw createHttpError(500, `Failed to upload side image ${i + 1}`);
					sideImageUrls.push(key);
				}
			}
		} else {
			// Retain existing side images if no new ones are uploaded
			const existingSideImages = req.body.existingSideImages;
			if (existingSideImages) {
				if (Array.isArray(existingSideImages)) {
					sideImageUrls = existingSideImages.filter(Boolean);
				} else if (typeof existingSideImages === "string") {
					sideImageUrls = [existingSideImages];
				}
			}
		}

		console.log(4);

		if (Array.isArray(files?.video) && files.video[0]) {
			const file = files.video[0];
			if (file?.originalname && file.buffer) {
				const ext = file.originalname.split(".").pop();
				const key = `business/${businessId}/product/${productId}/video.${ext}`;
				const result = await s3.write(key, file.buffer);
				if (!result) throw createHttpError(500, "Failed to upload video");
				videoUrl = key;
			}
		} else {
			// Retain existing video if no new one is uploaded
			const existingVideo = req.body.existingVideo;
			if (existingVideo && typeof existingVideo === "string") {
				videoUrl = existingVideo;
			}
		}

		// Only update fields that are provided, with type safety
		type ProductUpdateInput = Partial<ProductInput> & {
			mainImage?: string;
			sideImages?: string[];
			video?: string;
		};
		console.log(req.body);
		const baseData: ProductUpdateInput = { ...req.body };
		if (mainImageUrl) baseData.mainImage = mainImageUrl;
		if (sideImageUrls) baseData.sideImages = sideImageUrls;
		if (videoUrl) baseData.video = videoUrl;

		// Validate price and quantity
		const priceRaw = req.body.price;
		const quantityRaw = req.body.quantity;
		const price = priceRaw !== undefined ? Number(priceRaw) : undefined;
		const quantity =
			quantityRaw !== undefined ? Number(quantityRaw) : undefined;
		if (price === undefined || Number.isNaN(price) || price <= 0) {
			throw createHttpError.BadRequest(
				"Valid price is required and must be a positive number",
			);
		}
		if (quantity === undefined || Number.isNaN(quantity) || quantity < 0) {
			throw createHttpError.BadRequest(
				"Valid quantity is required and must be a non-negative number",
			);
		}
		baseData.price = price;
		baseData.quantity = quantity;

		const updated = await updateProductService(productId, baseData);
		res.json(updated);
	} catch (err) {
		next(err);
	}
};
