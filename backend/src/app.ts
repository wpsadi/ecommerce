import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { auth } from "#/src/config/auth";
import logger from "#config/logger";
import { errorMiddleware } from "#middlewares/error.middleware";

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
