import { Loader } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useProducts } from "../_hooks/products-load.paginated";
import { useProductStore } from "../_store/products.store";
import ProductCard from "./ProductCard";

function DisplayProducts() {
  const {
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts();
  const { viewMode } = useProductStore();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Flatten all products from all pages
  const products = data?.pages?.flatMap((page) => page.products) ?? [];

  // Infinite scroll: load more when loaderRef is visible
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new window.IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  if (isPending) {
    return (
      <div className="text-center py-12 items-center flex justify-center">
        <p className="text-slate-500 text-lg">
          {" "}
          Loading Products <Loader className="animate-spin inline" />
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">
          Error loading products: {error.message}
        </p>
      </div>
    );
  }

  if (products.length > 0) {
    return (
      <>
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
        <div ref={loaderRef} className="flex justify-center py-8">
          {isFetchingNextPage && <Loader className="animate-spin" />}
          {!hasNextPage && (
            <span className="text-slate-400">No more products to load.</span>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="text-center py-12">
      <p className="text-slate-500 text-lg">
        No products found matching your criteria.
      </p>
    </div>
  );
}

export default DisplayProducts;
