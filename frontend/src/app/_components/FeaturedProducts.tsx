import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProductsFew } from "../_hooks/products-few";
import ProductCard from "./ProductCard";

function FeaturedProducts() {
  const { data, isError, isPending } = useProductsFew();
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked items that showcase the finest craftsmanship and design
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.products.length === 0 && !isPending && !isError && (
            <div className="text-center py-12 col-span-full">
              <p className="text-muted-foreground text-lg">
                No featured products available.
              </p>
            </div>
          )}
          {data?.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {isPending && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Loading Products...
              </p>
            </div>
          )}

          {isError && (
            <div className="text-center py-12">
              <p className="text-destructive text-lg">
                Error loading featured products.
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button
              variant="outline"
              size="lg"
              className="border-border hover:bg-muted bg-transparent"
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
