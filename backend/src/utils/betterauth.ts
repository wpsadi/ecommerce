// Placeholder for BetterAuth API integration
// Implement actual API calls as needed

import { prisma } from "#config/prisma";

export async function checkUserRole(
	userId: string,
	resourceId: string,
	role: string,
	resourceType: "organization" | "business" = "organization",
): Promise<boolean> {
	try {
		if (resourceType === "organization") {
			// Check if user has the specified role in the organization
			const member = await prisma.member.findFirst({
				where: {
					userId: userId,
					organizationId: resourceId,
					role: role,
				},
			});
			return !!member;
		} else if (resourceType === "business") {
			// For business, we need to find the organization it belongs to
			// and check if user has the role in that organization
			const business = await prisma.business.findUnique({
				where: {
					id: resourceId,
				},
				select: {
					organizationId: true,
				},
			});

			if (!business) {
				return false;
			}

			// Check if user has the specified role in the business's organization
			const member = await prisma.member.findFirst({
				where: {
					userId: userId,
					organizationId: business.organizationId,
					role: role,
				},
			});
			return !!member;
		}

		return false;
	} catch (error) {
		console.error("Error checking user role:", error);
		return false;
	}
}

export async function getUserOrganizations(_userId: string) {
	// TODO: Replace with real BetterAuth API call
	return [];
}
