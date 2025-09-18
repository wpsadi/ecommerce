"use client";

import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useDeleteBusiness } from "../../_hooks/deleteBusiness";

export default function DeleteBusinessPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.businessId as string;
  const [error, setError] = useState("");
  const deleteBusinessMutation = useDeleteBusiness();

  useEffect(() => {
    if (!businessId) {
      setError("No business ID provided.");
    }
  }, [businessId]);

  const handleDelete = async () => {
    setError("");
    try {
      await deleteBusinessMutation.mutateAsync(businessId);
      router.push("/organization");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete business",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Delete Business</h1>
        <p className="mb-6 text-muted-foreground">
          Are you sure you want to delete this business? This action cannot be
          undone.
        </p>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex-1"
            disabled={deleteBusinessMutation.isPending}
          >
            {deleteBusinessMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Delete
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
