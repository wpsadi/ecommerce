import z from "zod";

export const listMyBusinessesValidators = {
	query: z.object(
		{
			limit: z
				.string()
				.default("20")
				.refine((val) => parseInt(val, 10) > 0, {
					error: "Limit must be greater than 0",
				})
				.transform((val) => parseInt(val, 10)),
			search: z.string().optional(),
			page: z
				.string()
				.default("1")
				.refine((val) => parseInt(val, 10) > 0, {
					error: "Page must be greater than 0",
				})
				.transform((val) => parseInt(val, 10)),
		},
		{
			error: "Query must not be empty",
		},
	),
};
