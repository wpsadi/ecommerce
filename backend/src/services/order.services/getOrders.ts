import { prisma } from "#config/prisma";

export interface GetOrdersOptions {
	userId: string;
	status?: string;
	page?: number;
	pageSize?: number;
}

export async function getOrdersService({
	userId,
	status,
	page = 1,
	pageSize = 10,
}: GetOrdersOptions) {
	const where: { userId: string; status?: string } = {
		userId,
		...(status ? { status } : {}),
	};
	const skip = (page - 1) * pageSize;
	const [orders, total] = await Promise.all([
		prisma.order.findMany({
			where,
			skip,
			take: pageSize,
			orderBy: { createdAt: "desc" },
			include: { items: true },
		}),
		prisma.order.count({ where }),
	]);
	return {
		orders,
		total,
		page,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	};
}
