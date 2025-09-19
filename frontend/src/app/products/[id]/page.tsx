"use client";

import { ArrowLeft, Heart, Share2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/cart.store";
import { formatINR } from "@/utils/currency";
import { MediaLibrary } from "./_components/MediaLibrary";
import { useProduct } from "./_hooks/loadProduct";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { data, isError, error, isPending } = useProduct(productId);

  const { addItem } = useCartStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [_isVideoPlaying, setIsVideoPlaying] = useState(false);

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted-foreground border-t-primary" />
          <span className="text-muted-foreground text-lg font-medium">
            Loading product details...
          </span>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center ">
        <div className="bg-destructive/10 border border-destructive rounded-lg p-8 flex flex-col items-center gap-4 shadow-md">
          <span className="text-destructive text-2xl font-bold">
            Error loading product
          </span>
          <span className="text-muted-foreground text-base">
            {error?.message || "Something went wrong. Please try again later."}
          </span>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mt-2"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const renderMarkdown = (text: string) => {
    return text
      .replace(
        /^# (.*$)/gm,
        '<h1 class="text-2xl font-bold mb-4 text-foreground">$1</h1>',
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-xl font-semibold mb-3 text-foreground">$1</h2>',
      )
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-lg font-medium mb-2 text-foreground">$1</h3>',
      )
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-foreground">$1</strong>',
      )
      .replace(/\*(.*?)\*/g, '<em class="italic text-muted-foreground">$1</em>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 text-muted-foreground">• $1</li>')
      .replace(
        /\n\n/g,
        '</p><p class="mb-4 text-muted-foreground leading-relaxed">',
      )
      .replace(
        /^(.+)$/gm,
        '<p class="mb-4 text-muted-foreground leading-relaxed">$1</p>',
      );
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 p-2 hover:bg-muted"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Media Gallery */}
          <div className="space-y-6">
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">
                  Product Media
                </h2>
                <MediaLibrary
                  mainImageUrl={data.mainImage || ""}
                  videoUrl={data.video || ""}
                  sideImageUrls={data.sideImages || []}
                  selectedImage={selectedImage}
                  productName={data.name}
                  onImageSelect={setSelectedImage}
                  onVideoToggle={setIsVideoPlaying}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Product Information */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-foreground text-balance drop-shadow-sm">
                  {data.name}
                </h1>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="p-2">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                {/* <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i.toString()}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    (4.8) • 24 reviews
                  </span>
                </div> */}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary drop-shadow">
                {formatINR(data.price)}
              </div>
              <p className="text-sm text-muted-foreground">
                Price includes all taxes
              </p>
            </div>

            {/* Tags */}
            {/*
            <div className="flex flex-wrap gap-2">
              {data.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
            */}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${data.quantity ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span
                className={`font-medium ${data.quantity ? "text-green-600" : "text-red-600"}`}
              >
                {data.quantity
                  ? `In Stock (${data.quantity} available)`
                  : "Out of Stock"}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            {data.quantity && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label className="font-medium text-foreground">
                    Quantity:
                  </Label>
                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 p-0 hover:bg-muted"
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-medium text-foreground">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setQuantity(Math.min(data.quantity, quantity + 1))
                      }
                      className="h-10 w-10 p-0 hover:bg-muted"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() =>
                      addItem({
                        productId: data.id,
                        quantity: quantity,
                      })
                    }
                    className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Link href="/cart" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-border hover:bg-muted bg-background"
                    >
                      Buy Now
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Product Description */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Description
              </h2>
              <div
                className="prose prose-sm max-w-none dark:prose-invert text-foreground"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(data.description || ""),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
