import { Router } from "express";
import { cancelOrderController } from "#controllers/order.controllers/cancelOrder";
import { createOrderController } from "#controllers/order.controllers/createOrder";
import { getOrdersController } from "#controllers/order.controllers/getOrders";
import { getSingleOrderController } from "#controllers/order.controllers/getSingleOrder";
import { authMiddleware } from "#middlewares/auth.middleware";

const ordersRouter = Router();

// Create order
ordersRouter.post("/", authMiddleware, createOrderController);

// Get orders list with pagination and status filter
ordersRouter.get("/", authMiddleware, getOrdersController);

// Get single order details (with ownership verification)
ordersRouter.get("/:orderId", authMiddleware, getSingleOrderController);

// Cancel order
ordersRouter.post("/:orderId/cancel", authMiddleware, cancelOrderController);

export { ordersRouter };
