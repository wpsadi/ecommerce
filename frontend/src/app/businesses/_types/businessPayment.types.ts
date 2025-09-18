import { z } from "zod";

// UPI ID format: [username]@[handle]
// For example: yourname@paytm, yourname@okicici, etc.
export const upiIdSchema = z
  .string()
  .min(3, "UPI ID is too short")
  .max(50, "UPI ID is too long")
  .regex(
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/,
    "UPI ID should be in format username@handle",
  )
  .optional()
  .nullable();

// Validator schema for business payment
export const businessPaymentSchema = z.object({
  businessId: z.string().min(1, "Business ID is required"),
  upiId: upiIdSchema,
});

// Types for BusinessPayment
export interface BusinessPayment {
  id: string;
  businessId: string;
  upiId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type BusinessPaymentInput = z.infer<typeof businessPaymentSchema>;

// Response type for business payment APIs
export interface BusinessPaymentResponse extends BusinessPayment {
  error?: string;
}
