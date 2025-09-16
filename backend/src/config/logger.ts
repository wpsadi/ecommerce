import winston from "winston";
import "winston-mongodb";

const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.json(),
	),
	defaultMeta: { service: "ecommerce-api" },
	transports: [
		...(process.env.NODE_ENV !== "production"
			? [
					new winston.transports.File({
						filename: "logs/error.log",
						level: "error",
					}),
					new winston.transports.File({ filename: "logs/combined.log" }),
				]
			: []),
		new winston.transports.MongoDB({
			db: process.env.DATABASE_URL, // your MongoDB URI
			options: { useUnifiedTopology: true },
			collection: "applogs", // collection where logs will be stored
			level: "info", // minimum level to log
			tryReconnect: true,
			capped: true, // optional: create capped collection
			cappedMax: 10000, // max number of docs in capped collection
		}),
	],
});

if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple(),
			),
		}),
	);
}

export default logger;
