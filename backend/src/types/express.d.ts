import type { Session, User } from "better-auth";

// Extend the Express Request interface to include `user` field from Prisma.
declare global {
	namespace Express {
		interface Request {
			user?: User;
			session?: Session;
		}
	}
}
