import type { NextFunction, Request, Response } from "express";
import { calculateBillService } from "#services/product.services/calculateBill";
import { calculateBillValidator } from "#validators/product.validations/calculateBillValidator";

export async function calculateBillController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parse = calculateBillValidator.parse(req.body);

		const result = await calculateBillService(parse);
		return res.json(result);
	} catch (err) {
		next(err);
	}
}
