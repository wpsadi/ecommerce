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
			collection: "applogs", // collection where logs will be stored
			level: "info", // minimum level to log
			tryReconnect: true,
			// optional: create capped collection
			storeHost: true,
			capped: true,
			expireAfterSeconds: 604800, // optional: expire logs after 7 days
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
