import { Router } from "express";
import { listMyBusinessesController } from "#controllers/business.controllers/listMyBusinesses.ts";
import { authMiddleware } from "#middlewares/auth.middleware.ts";

const businessRouter = Router();

businessRouter.get("/list", authMiddleware, listMyBusinessesController);
// businessRouter.post("/create",
export { businessRouter };
