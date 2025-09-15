import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { auth } from "#/src/config/auth";
import logger from "#config/logger";
import { errorMiddleware } from "#middlewares/error.middleware";
import { businessRouter } from "#routes/business.routes";
import { ordersRouter } from "#routes/orders.routes";
import { paymentRouter } from "#routes/payment.routes";
import { productsRouter } from "#routes/products.routes";

const app: Express = express();

// default middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	morgan("combined", {
		stream: { write: (message) => logger.info(message.trim()) },
	}),
);

// routes
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/api/business", businessRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentRouter);

// health routes
app.get("/health", (_req, res) => {
	res.status(200).json({
		status: "OK",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});

// universal route
app.all("*any", (req, res) => {
	res.status(404).json({
		error: "Route not found",
		path: req.path,
		uptime: process.uptime(),
	});
});

app.use(errorMiddleware);

export { app };
