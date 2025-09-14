import { PrismaClient } from "#/generated/prisma";

const prisma = new PrismaClient();

const connectDB = async () => {
	await prisma
		.$connect()
		.then(() => {
			console.log("Database connected");
		})
		.catch((error: unknown) => {
			console.error("Database connection failed:", error);
			process.exit(1);
		});
};

export { prisma, connectDB };
