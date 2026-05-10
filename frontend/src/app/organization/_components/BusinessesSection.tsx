import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Business, Organization } from "../_types";
import BusinessList from "./BusinessList";

interface BusinessesSectionProps {
  organization: Organization;
  businesses: Business[];
}

export default function BusinessesSection({
  organization,
  businesses,
}: BusinessesSectionProps) {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Businesses</h2>
        <Link href={`/businesses/create?organizationId=${organization.id}`}>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Business
          </Button>
        </Link>
      </div>

      {businesses.length === 0 ? (
        <EmptyBusinessState organization={organization} />
      ) : (
        <BusinessList businesses={businesses} />
      )}
    </section>
  );
}

function EmptyBusinessState({ organization }: { organization: Organization }) {
  return (
    <div className="border-0 shadow-lg rounded-lg bg-muted">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-4xl">🏢</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No businesses yet
        </h3>
        <p className="text-muted-foreground mb-4">
          Add your first business to start selling products
        </p>
        <Link
          href={`/organization/businesses/create?organizationId=${organization.id}`}
        >
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Business
          </Button>
        </Link>
      </div>
    </div>
  );
}
