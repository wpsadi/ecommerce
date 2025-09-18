import { CreditCard, Loader2, Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateBusinessPayment,
  useDeleteBusinessPayment,
  useGetBusinessPayment,
  useUpdateBusinessPayment,
} from "../_hooks/businessPayment";
import { validateUpiId } from "../_hooks/validateUpiId";

interface BusinessPaymentCardProps {
  businessId: string;
}

export const BusinessPaymentCard = ({
  businessId,
}: BusinessPaymentCardProps) => {
  const {
    data: payment,
    isLoading,
    isError,
  } = useGetBusinessPayment(businessId);
  const [upiId, setUpiId] = useState(payment?.upiId || "");

  const createMutation = useCreateBusinessPayment();
  const updateMutation = useUpdateBusinessPayment();
  const deleteMutation = useDeleteBusinessPayment();

  const isProcessing =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  // Update the UPI ID when payment data is loaded
  useEffect(() => {
    if (payment?.upiId) {
      setUpiId(payment.upiId);
    }
  }, [payment]);

  const handleSave = async () => {
    try {
      // Validate UPI ID before saving
      const validation = validateUpiId(upiId);
      if (!validation.valid) {
        toast.error("Invalid UPI ID", {
          description: validation.message,
        });
        return;
      }

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
      toast.success(payment ? "Payment updated" : "Payment added", {
        description: "Business payment details have been saved successfully.",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to save payment details",
      });
    }
  };

  const handleDelete = async () => {
    if (!payment) return;

    try {
      await deleteMutation.mutateAsync(businessId);
      setUpiId("");
      toast.success("Payment removed", {
        description: "Business payment details have been removed successfully.",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to remove payment details",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <p className="text-destructive">Failed to load payment details</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Payment Details</CardTitle>
        </div>
        <CardDescription>
          Configure payment information for receiving payments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="upiId">UPI ID</Label>
          <Input
            id="upiId"
            placeholder="yourname@bank"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            disabled={isProcessing}
          />
          <p className="text-xs text-muted-foreground">
            Provide your UPI ID to receive payments directly to your account
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleSave}
            disabled={isProcessing || !upiId.trim()}
            className="flex-1"
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isProcessing && <Save className="mr-2 h-4 w-4" />}
            {payment ? "Update Payment" : "Save Payment"}
          </Button>

          {payment && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isProcessing}
              size="icon"
              title="Remove payment details"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
