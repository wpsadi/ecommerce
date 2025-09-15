import { Router } from "express";
import { createBusinessController } from "#controllers/business.controllers/createBusiness";
import { deleteBusinessController } from "#controllers/business.controllers/deleteBusiness";
import { getBusinessController } from "#controllers/business.controllers/getBusiness";
import { listMyBusinessesController } from "#controllers/business.controllers/listMyBusinesses.ts";
import { updateBusinessController } from "#controllers/business.controllers/updateBusiness";
import { authMiddleware } from "#middlewares/auth.middleware.ts";

const businessRouter = Router();

businessRouter.get("/list", authMiddleware, listMyBusinessesController);
businessRouter.post("/create", authMiddleware, createBusinessController);
businessRouter.get("/:businessId", authMiddleware, getBusinessController);
businessRouter.put("/:businessId", authMiddleware, updateBusinessController);
businessRouter.delete("/:businessId", authMiddleware, deleteBusinessController);
export { businessRouter };
