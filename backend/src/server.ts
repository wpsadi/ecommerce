process.removeAllListeners("SIGINT");
process.removeAllListeners("SIGTERM");

import http from "node:http";
import { connectDB, prisma } from "#config/prisma";
import { connectRedis, disconnectRedis } from "#config/redis";
import { app } from "#src/app";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, async () => {
	console.log("Environment:", process.env.NODE_ENV);
	await connectDB();
	await connectRedis();
	console.log(`Server is running on port ${PORT}`);
});

// Handle process termination
process.on("SIGINT", async () => {
	console.log("Process interrupted. Closing connections...");

	await prisma.$disconnect().catch(() => {});
	await disconnectRedis();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	await prisma.$disconnect().catch(() => {});
	await disconnectRedis();

	process.exit(0);
});
