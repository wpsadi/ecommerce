// Organization types
export interface Organization {
  id: string;
  name: string;
  logo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Business types
export interface Business {
  id: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  banner?: string | null;
  organizationId: string;
  owner?: {
    id: string;
    name?: string | null;
  };
  isAllowed: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API response types
export interface OrganizationResponse {
  organization: Organization;
  error?: string;
}

export interface BusinessesResponse {
  businesses: Business[];
  nextCursor?: string | null;
  error?: string;
}

export interface BusinessResponse {
  business: Business;
  error?: string;
}
