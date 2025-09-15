import { Router } from "express";
import { createBusinessController } from "#controllers/business.controllers/createBusiness";
import { deleteBusinessController } from "#controllers/business.controllers/deleteBusiness";
import { getBusinessController } from "#controllers/business.controllers/getBusiness";
import { listMyBusinessesController } from "#controllers/business.controllers/listMyBusinesses.ts";
import { updateBusinessController } from "#controllers/business.controllers/updateBusiness";
import { createBusinessPaymentController } from "#controllers/businessPayment.controllers/createBusinessPayment";
import { deleteBusinessPaymentController } from "#controllers/businessPayment.controllers/deleteBusinessPayment";
import { getBusinessPaymentController } from "#controllers/businessPayment.controllers/getBusinessPayment";
import { updateBusinessPaymentController } from "#controllers/businessPayment.controllers/updateBusinessPayment";
import { authMiddleware } from "#middlewares/auth.middleware.ts";

const businessRouter = Router();

businessRouter.get("/list", authMiddleware, listMyBusinessesController);
businessRouter.post("/create", authMiddleware, createBusinessController);
businessRouter.get("/:businessId", authMiddleware, getBusinessController);
businessRouter.put("/:businessId", authMiddleware, updateBusinessController);
businessRouter.delete("/:businessId", authMiddleware, deleteBusinessController);
// Business Payment CRUD
businessRouter.get("/:businessId/payment", getBusinessPaymentController); // public
businessRouter.post(
	"/:businessId/payment",
	authMiddleware,
	createBusinessPaymentController,
); // owner only
businessRouter.put(
	"/:businessId/payment",
	authMiddleware,
	updateBusinessPaymentController,
); // owner only
businessRouter.delete(
	"/:businessId/payment",
	authMiddleware,
	deleteBusinessPaymentController,
); // owner only
export { businessRouter };
