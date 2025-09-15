import { Router } from "express";
import { cancelOrderController } from "#controllers/order.controllers/cancelOrder";
import { createOrderController } from "#controllers/order.controllers/createOrder";
import { getOrdersController } from "#controllers/order.controllers/getOrders";
import { authMiddleware } from "#middlewares/auth.middleware";

const ordersRouter = Router();

// Create order
ordersRouter.post("/", authMiddleware, createOrderController);

// Get orders list with pagination and status filter
ordersRouter.get("/", authMiddleware, getOrdersController);

// Cancel order
ordersRouter.post("/:orderId/cancel", authMiddleware, cancelOrderController);

export { ordersRouter };
