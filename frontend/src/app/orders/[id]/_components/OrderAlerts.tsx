import { CreditCard, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function CancelledOrderAlert() {
  return (
    <Alert className="mb-6 border-destructive bg-destructive/10">
      <X className="h-4 w-4 text-destructive" />
      <AlertDescription className="text-destructive">
        This order has been cancelled. If you were charged, a refund will be
        processed within 5-7 business days.
      </AlertDescription>
    </Alert>
  );
}

export function PaymentFailedAlert({
  onRetry,
  isProcessing,
}: {
  onRetry: () => void;
  isProcessing: boolean;
}) {
  return (
    <Alert className="mb-6 border-destructive bg-destructive/10">
      <CreditCard className="h-4 w-4 text-destructive" />
      <AlertDescription className="text-destructive flex items-center justify-between">
        <span>
          Payment failed for this order. Please retry payment to confirm your
          order.
        </span>
        <Button
          size="sm"
          onClick={onRetry}
          disabled={isProcessing}
          className="ml-4 bg-destructive hover:bg-destructive/80 text-destructive-foreground"
        >
          {isProcessing ? (
            <>
              <div className="mr-2 h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></div>
              Processing...
            </>
          ) : (
            <>
              <X className="mr-2 h-3 w-3" />
              Retry Payment
            </>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
