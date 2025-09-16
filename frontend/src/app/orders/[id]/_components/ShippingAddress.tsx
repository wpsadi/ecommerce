import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShippingAddress({
  address,
}: {
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
}) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Shipping Address</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted rounded-lg">
          <p className="font-medium text-foreground mb-2">Delivery Address</p>
          <p className="text-muted-foreground">
            {address.street}
            <br />
            {address.city}, {address.state}
            <br />
            {address.pincode}, {address.country}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
