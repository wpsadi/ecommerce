import { Router } from "express";
import { uploadProductAssets } from "#config/multer";
import { createProductController } from "#controllers/product.controllers/createProduct";
import { deleteProductController } from "#controllers/product.controllers/deleteProduct";
import { getProductController } from "#controllers/product.controllers/getProduct";
import { getProductsController } from "#controllers/product.controllers/getProducts";
import { listProductsController } from "#controllers/product.controllers/listProducts";
import { searchProductsController } from "#controllers/product.controllers/searchProducts";
import { updateProductController } from "#controllers/product.controllers/updateProduct";
import { authMiddleware } from "#middlewares/auth.middleware.ts";

const productsRouter = Router();

// List all products with pagination (public)
productsRouter.get("/", listProductsController);
// Search products by name with pagination (public)
productsRouter.get("/search", searchProductsController);
// List all products for a business (public)
productsRouter.get("/business/:businessId", getProductsController);
// Get a single product (public)
productsRouter.get("/:productId", getProductController);
// Create product (owner only)
productsRouter.post(
	"/",
	authMiddleware,
	uploadProductAssets.fields([
		{ name: "mainImage", maxCount: 1 },
		{ name: "sideImages", maxCount: 8 },
		{ name: "video", maxCount: 1 },
	]),
	createProductController,
);
// Update product (owner only)
productsRouter.put(
	"/:productId",
	authMiddleware,
	uploadProductAssets.fields([
		{ name: "mainImage", maxCount: 1 },
		{ name: "sideImages", maxCount: 8 },
		{ name: "video", maxCount: 1 },
	]),
	updateProductController,
);
// Delete product (owner only)
productsRouter.delete("/:productId", authMiddleware, deleteProductController);

export { productsRouter };
