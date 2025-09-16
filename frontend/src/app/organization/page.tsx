"use client";

import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingScreen";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import BusinessesSection from "./_components/BusinessesSection";
import OrganizationHeader from "./_components/OrganizationHeader";
import OrganizationStats from "./_components/OrganizationStats";
import { useOrganization } from "./_hooks/getOrganization";
import { useMyBusiness } from "./_hooks/useMyBusiness";

export default function OrganizationDetailPage() {
  const router = useRouter();
  const {
    data: orgData,
    isPending: orgPending,
    isError: orgError,
    error: orgErrorObj,
  } = useOrganization();

  const {
    data: businessData,
    isPending: bizPending,
    isError: bizError,
    error: bizErrorObj,
  } = useMyBusiness();

  // Handle loading state
  if (orgPending || bizPending) {
    return <LoadingSpinner />;
  }

  // Handle organization error
  if (orgError || !orgData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert variant="destructive" className="max-w-md w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {orgErrorObj instanceof Error
              ? orgErrorObj.message
              : "No organization found."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle business data error
  if (bizError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert variant="destructive" className="max-w-md w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {bizErrorObj instanceof Error
              ? bizErrorObj.message
              : "Could not load businesses."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const organization = {
    ...orgData,
    updatedAt: orgData.createdAt || new Date(), // Ensure updatedAt is present
  };
  const orgBusinesses =
    businessData?.pages?.flatMap((page) =>
      page.businesses.map((business) => ({
        ...business,
        createdAt: new Date(), // Convert to Date object
        updatedAt: new Date(), // Convert to Date object
      })),
    ) || [];
  // No productsCount available, so just pass 0 for now
  const productsCount = 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 p-2 hover:bg-muted"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Organizations
        </Button>

        {/* Organization Header & Stats */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <OrganizationHeader organization={organization} />
          <OrganizationStats
            businessesCount={orgBusinesses.length}
            productsCount={productsCount}
          />
        </div>

        {/* Businesses Section */}
        <BusinessesSection
          organization={organization}
          businesses={orgBusinesses}
        />
      </main>
      <Footer />
    </div>
  );
}
