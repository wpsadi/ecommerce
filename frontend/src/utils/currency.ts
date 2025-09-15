// Currency utilities for INR formatting
export function formatINR(amountInPaise: number): string {
  const amount = amountInPaise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function parseINR(formattedAmount: string): number {
  // Remove currency symbol and convert to paise
  const amount = Number.parseFloat(formattedAmount.replace(/[₹,\s]/g, ""));
  return Math.round(amount * 100);
}
