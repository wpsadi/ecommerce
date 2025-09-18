"use client";

import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBusinessProducts } from "./_hooks/listBusinessProducts";

export default function BusinessProductsPage() {
  const params = useParams();
  const _router = useRouter();
  const businessId = params.businessId as string;
  const { data, isPending, isError, error } = useBusinessProducts(businessId);
  type Product = {
    mainImage: string | undefined;
    sideImages: string[];
    video: string | undefined;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    quantity: number;
    businessId: string;
    description: string | null;
    price: number;
  };
  const products = (data ?? []) as Product[];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href={`/businesses/${businessId}/products/create`}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Product
          </Button>
        </Link>
      </div>

      {isPending ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : isError ? (
        <div className="text-destructive text-lg font-semibold text-center">
          {error instanceof Error ? error.message : "Failed to load products."}
        </div>
      ) : !products || products.length === 0 ? (
        <div className="text-muted-foreground text-center py-12">
          No products found for this business.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: Product) => (
            <Card key={product.id} className="shadow-md border-0 flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {product.mainImage ? (
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg line-clamp-1">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {product.description || "No description"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-base font-semibold text-primary">
                    ₹{product.price}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Qty: {product.quantity}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/products/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View
                    </Button>
                  </Link>
                  <Link
                    href={`/businesses/${businessId}/products/${product.id}/edit`}
                    className="flex-1"
                  >
                    <Button
                      variant="secondary"
                      className="w-full flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Update
                    </Button>
                  </Link>
                  <Link
                    href={`/businesses/${businessId}/products/${product.id}/delete`}
                    className="flex-1"
                  >
                    <Button
                      variant="destructive"
                      className="w-full flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
