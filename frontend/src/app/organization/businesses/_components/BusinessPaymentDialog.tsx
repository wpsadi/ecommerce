import { AlertCircle, CreditCard, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateBusinessPayment,
  useGetBusinessPayment,
  useUpdateBusinessPayment,
} from "../_hooks/businessPayment";
import { validateUpiId } from "../_hooks/validateUpiId";

interface BusinessPaymentDialogProps {
  businessId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const BusinessPaymentDialog = ({
  businessId,
  open,
  onOpenChange,
  onSuccess,
}: BusinessPaymentDialogProps) => {
  const { data: payment, isLoading } = useGetBusinessPayment(businessId);
  const [upiId, setUpiId] = useState("");

  const createMutation = useCreateBusinessPayment();
  const updateMutation = useUpdateBusinessPayment();

  const isProcessing = createMutation.isPending || updateMutation.isPending;

  // Update the UPI ID when payment data is loaded
  useEffect(() => {
    if (payment?.upiId) {
      setUpiId(payment.upiId);
    }
  }, [payment]);

  const [validationError, setValidationError] = useState("");

  // Validate UPI ID on change
  useEffect(() => {
    if (upiId) {
      const validation = validateUpiId(upiId);
      setValidationError(validation.valid ? "" : validation.message || "");
    } else {
      setValidationError("");
    }
  }, [upiId]);

  const handleSave = async () => {
    try {
      // Check validation before saving
      if (validationError) return;

      if (payment) {
        // If payment exists, update it
        await updateMutation.mutateAsync({
          businessId,
          upiId,
        });
      } else {
        // If payment doesn't exist, create it
        await createMutation.mutateAsync({
          businessId,
          upiId,
        });
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving payment details:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {payment ? "Update Payment Details" : "Add Payment Details"}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="yourname@bank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                disabled={isProcessing}
              />
              {validationError ? (
                <div className="mt-2">
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{validationError}</AlertDescription>
                  </Alert>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Provide your UPI ID to receive payments directly to your
                  account (format: username@bank)
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isProcessing || !upiId.trim() || !!validationError}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {payment ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
