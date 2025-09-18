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
  .optional();

export const validateUpiId = (
  upiId: string,
): { valid: boolean; message?: string } => {
  try {
    upiIdSchema.parse(upiId);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        message: error.issues[0]?.message || "Invalid UPI ID",
      };
    }
    return { valid: false, message: "Invalid UPI ID" };
  }
};

export const useUpiIdValidator = (upiId: string) => {
  if (!upiId) return { valid: true }; // Empty is considered valid (optional)
  return validateUpiId(upiId);
};
