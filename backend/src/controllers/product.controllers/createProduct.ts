import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { s3 } from "#config/s3";
import { createProductService } from "#services/product.services/createProduct";
import { checkUserRole } from "#utils/betterauth";
import { productValidator } from "#validators/product.validations/productValidator";

export const createProductController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		console.log("Request body:", req.body);
		const validation = productValidator.body.parse(req.body);
		if (!req.user)
			throw createHttpError.Unauthorized("Please login to continue");
		// Only owner of business can create product
		const isOwner = await checkUserRole(
			req.user.id,
			validation.businessId,
			"owner",
			"business",
		);
		if (!isOwner)
			throw createHttpError.Forbidden("You must be an owner of this business");
		// File upload logic for mainImage, sideImages, video
		// mainImage: single file, sideImages: array, video: single file
		const files = req.files as Record<
			string,
			Express.Multer.File[] | undefined
		>;
		let mainImageUrl = "";
		const sideImageUrls: string[] = [];
		let videoUrl = "";

		// S3 path: /business/{businessId}/product/{productId}/images or /video
		const businessId = validation.businessId;
		// We'll generate a temp productId for S3 path uniqueness (replace with actual after create if needed)
		const tempProductId = Date.now().toString();

		if (Array.isArray(files.mainImage) && files.mainImage[0]) {
			const file = files.mainImage[0];
			if (file?.originalname && file.buffer) {
				const ext = file.originalname.split(".").pop();
				const key = `business/${businessId}/product/${tempProductId}/mainImage.${ext}`;
				const result = await s3.write(key, file.buffer);
				if (!result) throw createHttpError(500, "Failed to upload main image");
				mainImageUrl = key;
			}
		}

		if (Array.isArray(files.sideImages) && files.sideImages.length > 0) {
			for (let i = 0; i < files.sideImages.length; i++) {
				const file = files.sideImages[i];
				if (file?.originalname && file.buffer) {
					const ext = file.originalname.split(".").pop();
					const key = `business/${businessId}/product/${tempProductId}/sideImage${i + 1}.${ext}`;
					const result = await s3.write(key, file.buffer);
					if (!result)
						throw createHttpError(500, `Failed to upload side image ${i + 1}`);
					sideImageUrls.push(key);
				}
			}
		}

		if (Array.isArray(files.video) && files.video[0]) {
			const file = files.video[0];
			if (file?.originalname && file.buffer) {
				const ext = file.originalname.split(".").pop();
				const key = `business/${businessId}/product/${tempProductId}/video.${ext}`;
				const result = await s3.write(key, file.buffer);
				if (!result) throw createHttpError(500, "Failed to upload video");
				videoUrl = key;
			}
		}

		const product = await createProductService({
			...validation,
			mainImage: mainImageUrl,
			sideImages: sideImageUrls,
			video: videoUrl,
		});
		res.status(201).json(product);
	} catch (err) {
		next(err);
	}
};
