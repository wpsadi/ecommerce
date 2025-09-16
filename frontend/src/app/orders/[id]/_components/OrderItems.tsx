import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Order } from "@/types/type";
import { formatINR } from "@/utils/currency";

export default function OrderItems({ items }: { items: Order["items"] }) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Order Items</CardTitle>
        <CardDescription>{items.length} items in this order</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 bg-muted rounded-lg">
            <div className="w-20 h-20 bg-background rounded overflow-hidden flex-shrink-0">
              <Image
                src={item.product.mainImage || "/placeholder.svg"}
                alt={item.product.name}
                height={80}
                width={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.product.id}`}>
                <h4 className="font-semibold text-foreground hover:text-muted-foreground line-clamp-2">
                  {item.product.name}
                </h4>
              </Link>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {item.product.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </span>
                  <span className="font-medium text-foreground">
                    {formatINR(item.price)}
                  </span>
                </div>
                <span className="font-bold text-lg text-foreground">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
