import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { prisma } from "#config/prisma.ts";
import { listMyBusinessesValidators } from "#validators/business.validations/listMyBusinessesValidators.ts";

export const listMyBusinessesController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.user) {
			throw createHttpError.Unauthorized("Unauthorized");
		}
		const { limit, page, search } = listMyBusinessesValidators.query.parse(req);

		// Fetch businesses directly with pagination
		const allBusinesses = await prisma.business.findMany({
			where: {
				organization: {
					members: {
						some: {
							userId: req.user.id,
						},
					},
				},
				...(search && {
					OR: [
						{ name: { contains: search, mode: "insensitive" } },
						{ description: { contains: search, mode: "insensitive" } },
					],
				}),
			},
			select: {
				name: true,
				organizationId: true,
				description: true,
				address: true,
				businessType: true,
				id: true,
				isVerified: true,
				email: true,
				phone: true,
				website: true,
				isAllowed: true,
			},
			take: limit,
			skip: (page - 1) * limit,
			orderBy: [{ createdAt: "desc" }, { name: "asc" }],
		});

		const data = {
			businesses: allBusinesses,
			message: "Businesses fetched successfully",
			pagination: {
				page,
				limit,
				hasMore: allBusinesses.length === limit,
			},
		};

		res.json(data);
	} catch (err) {
		next(err);
	}
};
