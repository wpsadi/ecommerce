import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { auth } from "#config/auth";
export const authMiddleware = async (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	try {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(req.headers),
		});
		if (!session) {
			throw createError.Unauthorized("Unauthorized");
		}

		if (!session.user || !session.session) {
			throw createError.Unauthorized("Unauthorized");
		}

		// ensure email is verified
		if (!session.user.emailVerified) {
			throw createError.Unauthorized("Email not verified");
		}

		// assign and assert non-nullable for TypeScript consumers
		req.session = session.session;
		req.user = session.user as NonNullable<typeof session.user>;

		next();
	} catch (err) {
		next(err);
	}
};
