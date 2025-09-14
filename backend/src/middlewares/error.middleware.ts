import { logger } from "better-auth";
import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { z } from "zod";
import { formatValidationError } from "#utils/format";

export const errorMiddleware = (
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	logger.error((err as Error).message);
	if (err instanceof z.ZodError) {
		return res.status(400).json({ error: formatValidationError(err) });
	}
	if (createHttpError.isHttpError(err)) {
		return res.status(err.statusCode).json({ error: err.message });
	}
	return res.status(500).json({
		error: (err as Error).message || "Internal Server Error",
		details: err,
	});
};
