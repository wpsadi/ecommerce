import { Building2 } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Organization } from "../_types";

interface OrganizationHeaderProps {
  organization: Organization;
}

export default function OrganizationHeader({
  organization,
}: OrganizationHeaderProps) {
  return (
    <Card className="flex-1 border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
              {organization.logo ? (
                <Image
                  src={organization.logo || "/placeholder.svg"}
                  alt={organization.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-2xl">{organization.name}</CardTitle>
              <CardDescription className="mt-1 text-base">
                Organization ID: {organization.id}
              </CardDescription>
            </div>
          </div>
          {/* <Link href={`/organization/settings`}>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link> */}
        </div>
      </CardHeader>
    </Card>
  );
}
