import { Router } from "express";
import { getPaymentStatusController } from "#controllers/payment.controllers/getPaymentStatus";
import { verifyPaymentController } from "#controllers/payment.controllers/verifyPayment";
import { authMiddleware } from "#middlewares/auth.middleware";

const paymentRouter = Router();

// Verify payment (Razorpay callback)
paymentRouter.post("/razorpay/callback", verifyPaymentController);

// Get payment status
paymentRouter.get("/:orderId", authMiddleware, getPaymentStatusController);

export { paymentRouter };
