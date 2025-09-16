import { OrganizationInput } from "better-auth/plugins/organization";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  mainImage: string;
  sideImages: string[];
  video: string;
  business: {
    id: string;
    name: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface Business {
  organization: OrganizationInput;
  BusinesPaymentInfo: {
    businessId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    upiId: string | null;
  } | null;
  name: string;
  description: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  address: string | null;
  phone: string | null;
  businessType: "INDIVIDUAL" | "COMPANY";
  email: string | null;
  website: string | null;
  isAllowed: boolean;
  isVerified: boolean;
}

export interface Order {
  items: {
    product: {
      mainImage: string | undefined;
      sideImages: string[];
      video: string | undefined;
      business: {
        id: string;
        name: string;
      };
      quantity: number;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      description: string | null;
      price: number;
      businessId: string;
    };
    productId: string;
    quantity: number;
    orderId: string;
    id: string;
    price: number;
  }[];
  user: {
    id: string;
    email: string;
    name: string;
  };
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  totalAmount: number;
  status: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
}
