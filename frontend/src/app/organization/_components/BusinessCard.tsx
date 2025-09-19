import { CreditCard, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useGetBusinessPayment } from "@/app/businesses/_hooks/businessPayment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Business } from "../_types";
import DeleteBusinessDialog from "./DeleteBusinessDialog";
import UpdateBusinessDialog from "./UpdateBusinessDialog";

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const { data, isPending, isError } = useGetBusinessPayment(business.id);
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
              {business.logo ? (
                <Image
                  src={business.logo}
                  alt={business.name}
                  height={48}
                  width={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{business.name}</CardTitle>
              <CardDescription className="text-sm">
                {business.description || "No description"}
              </CardDescription>
            </div>
          </div>
          <Badge variant={data?.upiId ? "default" : "secondary"}>
            {data?.upiId ? "Setup Complete" : "Setup Needed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Details Section */}
        {isPending ? (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg animate-pulse min-h-[48px]">
            <div className="h-4 w-4 bg-muted-foreground rounded-full" />
            <div className="h-4 w-32 bg-muted-foreground rounded" />
          </div>
        ) : isError || !data ? (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Payment setup required
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">
                Payment details configured
              </span>
            </div>
            {/* Show payment details if available */}
            {data.upiId && (
              <div className="text-xs text-muted-foreground pl-6">
                UPI: <span className="font-mono">{data.upiId}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex gap-2">
          {/* <Link href={`/businesses/${business.id}/products`} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-border hover:bg-background bg-background"
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
          </Link> */}
          <Link href={`/businesses/${business.id}/products`} className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/90">
              <Package className="mr-2 h-4 w-4" />
              Products
            </Button>
          </Link>
          <UpdateBusinessDialog business={business} />
          <DeleteBusinessDialog business={business} />
        </div>
      </CardContent>
    </Card>
  );
}
