import { RedisClient } from "bun";

const redis = new RedisClient(
	process.env.REDIS_URL || "redis://localhost:6379",
	{
		// Connection timeout in milliseconds (default: 10000)
		connectionTimeout: 5000,

		// Idle timeout in milliseconds (default: 0 = no timeout)
		idleTimeout: 30000,

		// Whether to automatically reconnect on disconnection (default: true)
		autoReconnect: true,

		// Maximum number of reconnection attempts (default: 10)
		maxRetries: 10,

		// Whether to queue commands when disconnected (default: true)
		enableOfflineQueue: true,

		// Whether to automatically pipeline commands (default: true)
		enableAutoPipelining: true,

		// TLS options (default: false)
		tls: true,
	},
);

export const connectRedis = async () => {
	await redis.connect();
	console.log("Connected to Redis");
};

export const disconnectRedis = async () => {
	try {
		if (redis.connected) {
			redis.close();
		}
	} catch (e) {
		console.error("Error closing Redis connection:", e);
	}
};

export { redis };
