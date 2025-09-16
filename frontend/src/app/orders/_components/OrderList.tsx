import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useOrders } from "../_hooks/useOrders";
import EmptyOrders from "./EmptyOrders";
import OrderCard from "./OrderCard";

export default function OrderList() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOrders();

  const orders = data?.pages.flatMap((page) => page.orders) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i.toString()}
            className="h-40 bg-muted rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-destructive font-semibold py-8">
        {error instanceof Error ? error.message : "Failed to load orders."}
      </div>
    );
  }

  if (orders.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <div className="space-y-6">
      {orders
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? (
              "Loading..."
            ) : (
              <>
                <span>Load More</span> <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
