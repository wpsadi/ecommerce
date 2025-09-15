import createHttpError from "http-errors";
import { v4 as uuidv4 } from "uuid"; // Add this import for UUID generation
import type { z } from "zod";
import type { Prisma } from "#/generated/prisma";
import { prisma } from "#config/prisma";
import type { createBusinessValidator } from "#validators/business.validations/createBusinessValidator";

export async function createBusinessService(
	data: z.infer<typeof createBusinessValidator.body>,
) {
	// Business logic: create a business for an organization
	const organization = await prisma.organization.findUnique({
		where: { id: data.organizationId },
	});
	if (!organization) {
		throw createHttpError(404, "Organization not found");
	}
	const {
		organizationId,
		name,
		address,
		phone,
		description,
		businessType,
		email,
		website,
	} = data;
	const businessData: Prisma.BusinessUncheckedCreateInput = {
		id: uuidv4(), // Generate a unique ID
		organizationId,
		name,
		businessType,
		address: address ?? undefined,
		phone: phone ?? undefined,
		description: description ?? undefined,
		email: email ?? undefined,
		website: website ?? undefined,
	};
	if (address !== undefined) businessData.address = address;
	if (phone !== undefined) businessData.phone = phone;
	if (description !== undefined) businessData.description = description;
	if (email !== undefined) businessData.email = email;
	if (website !== undefined) businessData.website = website;
	const business = await prisma.business.create({
		data: businessData,
	});
	return business;
}
