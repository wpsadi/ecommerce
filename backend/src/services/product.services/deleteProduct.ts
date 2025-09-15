import createHttpError from "http-errors";
import { prisma } from "#config/prisma";

export async function deleteProductService(productId: string) {
	const product = await prisma.product.findUnique({ where: { id: productId } });
	if (!product) throw createHttpError(404, "Product not found");
	await prisma.product.delete({ where: { id: productId } });
	return { message: "Product deleted successfully" };
}
