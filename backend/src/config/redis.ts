import { createClient } from "redis";

const redis = createClient({
	url: process.env.REDIS_URL,
	pingInterval: 10000,
});

export const connectRedis = async () => {
	redis.on("error", (err) => console.log("Redis Client Error", err));
	await redis.connect();
	console.log("Connected to Redis");
};

export const disconnectRedis = async () => {
	try {
		if (redis.isOpen) {
			await redis.quit();
		}
	} catch (e) {
		console.error("Error closing Redis connection:", e);
	}
};

export { redis };
