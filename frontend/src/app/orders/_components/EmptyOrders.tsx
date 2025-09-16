import { Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptyOrders() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No orders yet
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        When you place your first order, it will appear here. Start shopping to
        see your order history!
      </p>
      <Link href="/products">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Package className="mr-2 h-4 w-4" />
          Start Shopping
        </Button>
      </Link>
    </div>
  );
}
