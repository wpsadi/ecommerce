import { Card, CardContent } from "@/components/ui/card";

interface OrganizationStatsProps {
  businessesCount: number;
  productsCount: number;
}

export default function OrganizationStats({
  businessesCount,
  productsCount,
}: OrganizationStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:w-48">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-foreground">
            {businessesCount}
          </div>
          <div className="text-sm text-muted-foreground">Businesses</div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-foreground">
            {productsCount}
          </div>
          <div className="text-sm text-muted-foreground">Products</div>
        </CardContent>
      </Card>
    </div>
  );
}
