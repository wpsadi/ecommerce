import type { Request } from "express";
import type { FileFilterCallback } from "multer";
import multer from "multer";

// Storage engine for multer (memory storage, as files will be uploaded to S3)
const storage = multer.memoryStorage();

// File filter for images and videos
const fileFilter = (
	_req: Request,
	file: Express.Multer.File,
	cb: FileFilterCallback,
) => {
	const allowedTypes = [
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/gif",
		"video/mp4",
		"video/webm",
		"video/quicktime",
	];
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Invalid file type. Only images and videos are allowed."));
	}
};

// Multer upload instance for product assets
export const uploadProductAssets = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 20 * 1024 * 1024, // 20MB max per file
		files: 10, // max 10 files (1 main, up to 8 side, 1 video)
	},
});
