import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchProducts } from "../_hooks/useSearchProducts";
import SearchProductCard from "./SearchProductCard";

export default function SearchProductList({ query }: { query: string }) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchProducts(query);

  const products = data?.pages.flatMap((page) => page.products) || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i.toString()}
            className="h-64 bg-muted rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-destructive font-semibold py-8">
        {error instanceof Error ? error.message : "Failed to load products."}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl text-muted-foreground">🔍</span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No products found
        </h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search terms or browse our categories
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <SearchProductCard
            key={product.id}
            product={{
              ...product,
              mainImage: product.mainImage || "", // Ensure mainImage is always a string
              video: product.video || "", // Ensure video is always a string
              createdAt: product.createdAt.toISOString(), // Convert Date to string
              updatedAt: product.updatedAt.toISOString(), // Convert Date to string
            }}
          />
        ))}
      </div>
      {hasNextPage && (
        <div className="flex justify-center pt-6">
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
    </>
  );
}
