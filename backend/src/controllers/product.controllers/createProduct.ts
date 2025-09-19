import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { s3, getSignedUrl } from "#config/s3";
import { createProductService } from "#services/product.services/createProduct";
import { updateProductService } from "#services/product.services/updateProduct";
import { checkUserRole } from "#utils/betterauth";
import { productValidator } from "#validators/product.validations/productValidator";


export const createProductController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		// Validate input
		const validation = productValidator.body.parse( req.body );
		if ( !req.user )
			throw createHttpError.Unauthorized( "Please login to continue" );
		// Only owner of business can create product
		const isOwner = await checkUserRole(
			req.user.id,
			validation.businessId,
			"owner",
			"business",
		);
		if ( !isOwner )
			throw createHttpError.Forbidden( "You must be an owner of this business" );

		// 1. Upload files to S3 and get URLs
		const files = req.files as Record<string, Express.Multer.File[] | undefined>;
		let mainImageUrl = "";
		const sideImageUrls: string[] = [];
		let videoUrl = "";
		const businessId = validation.businessId;
		// Generate a productId for S3 paths and DB (use uuid)
		const { v4: uuidv4 } = await import( "uuid" );
		const productId = uuidv4();

		if ( Array.isArray( files.mainImage ) && files.mainImage[0] ) {
			const file = files.mainImage[0];
			if ( file?.originalname && file.buffer ) {
				const ext = file.originalname.split( "." ).pop();
				const key = `business/${businessId}/product/${productId}/mainImage.${ext}`;
				const result = await s3.write( key, file.buffer );
				if ( !result ) throw createHttpError( 500, "Failed to upload main image" );
				mainImageUrl = await getSignedUrl( key );
			}
		}

		if ( Array.isArray( files.sideImages ) && files.sideImages.length > 0 ) {
			for ( let i = 0; i < files.sideImages.length; i++ ) {
				const file = files.sideImages[i];
				if ( file?.originalname && file.buffer ) {
					const ext = file.originalname.split( "." ).pop();
					const key = `business/${businessId}/product/${productId}/sideImage${i + 1}.${ext}`;
					const result = await s3.write( key, file.buffer );
					if ( !result )
						throw createHttpError( 500, `Failed to upload side image ${i + 1}` );
					const signedUrl = await getSignedUrl( key );
					sideImageUrls.push( signedUrl );
				}
			}
		}

		if ( Array.isArray( files.video ) && files.video[0] ) {
			const file = files.video[0];
			if ( file?.originalname && file.buffer ) {
				const ext = file.originalname.split( "." ).pop();
				const key = `business/${businessId}/product/${productId}/video.${ext}`;
				const result = await s3.write( key, file.buffer );
				if ( !result ) throw createHttpError( 500, "Failed to upload video" );
				videoUrl = await getSignedUrl( key );
			}
		}

		// 2. Create product in DB with all data (including media URLs)
		const product = await createProductService( {
			...validation,
			businessId,
			mainImage: mainImageUrl,
			sideImages: sideImageUrls,
			video: videoUrl,
		} );

		res.status( 201 ).json( product );
	} catch ( err ) {
		next( err );
	}
};
