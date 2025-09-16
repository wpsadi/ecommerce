import { prisma } from "#config/prisma";
import type { CalculateBillInput } from "#validators/product.validations/calculateBillValidator";

export async function calculateBillService(input: CalculateBillInput) {
	const { items } = input;
	if (!items.length) {
		return { items: [], total: 0 };
	}

	// Fetch all products in one query
	const products = await prisma.product.findMany({
		where: {
			id: { in: items.map((i) => i.productId) },
		},
		select: {
			id: true,
			name: true,
			price: true,
		},
	});

	// Map productId to product for quick lookup
	const productMap = new Map(products.map((p) => [p.id, p]));

	// Build bill items
	const billItems = items
		.map(({ productId, quantity }) => {
			const product = productMap.get(productId);
			if (!product) return null;
			const totalPrice = product.price * quantity;
			return {
				productId,
				name: product.name,
				quantity,
				totalPrice,
			};
		})
		.filter(
			(
				item,
			): item is {
				productId: string;
				name: string;
				quantity: number;
				totalPrice: number;
			} => !!item,
		);

	const total = billItems.reduce((sum, item) => sum + item.totalPrice, 0);

	return {
		items: billItems,
		total,
	};
}
