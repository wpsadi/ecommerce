"use client";

import {
  ArrowLeft,
  Heart,
  Play,
  Save,
  Share2,
  Trash2,
  Upload,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { formatINR } from "@/utils/currency";
import { useGetProduct } from "../../_hooks/getProduct";
import { useDeleteProduct, useUpdateProduct } from "../../_hooks/updateProduct";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.businessId as string;
  const productId = params.productId as string;

  const { data: product, isPending, isError, error } = useGetProduct(productId);
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [sideImages, setSideImages] = useState<string[]>(["", "", ""]);
  const [video, setVideo] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Description tabs
  const [descriptionTab, setDescriptionTab] = useState<"edit" | "preview">(
    "preview",
  );

  // Load product data when available
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price.toString());
      setQuantity(product.quantity.toString());
      setDescription(product.description || "");
      setMainImage(product.mainImage || "");
      setSideImages([
        product.sideImages?.[0] || "",
        product.sideImages?.[1] || "",
        product.sideImages?.[2] || "",
      ]);
      setVideo(product.video || "");
    }
  }, [product]);

  const allMedia = [
    mainImage,
    ...(video ? [video] : []),
    ...sideImages.filter(Boolean),
  ].filter(Boolean);

  const renderMarkdown = (text: string) => {
    return text
      .replace(
        /^# (.*$)/gm,
        '<h1 class="text-2xl font-bold mb-4 text-slate-900">$1</h1>',
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-xl font-semibold mb-3 text-slate-900">$1</h2>',
      )
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-lg font-medium mb-2 text-slate-900">$1</h3>',
      )
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-slate-900">$1</strong>',
      )
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 text-slate-700">• $1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-slate-700 leading-relaxed">')
      .replace(
        /^(.+)$/gm,
        '<p class="mb-4 text-slate-700 leading-relaxed">$1</p>',
      );
  };

  const handleUpdateProduct = async () => {
    if (!name.trim() || !price) return;

    try {
      await updateProductMutation.mutateAsync({
        productId,
        formData: {
          name: name.trim(),
          price: Number(price),
          quantity: Number(quantity),
          description: description.trim() || undefined,
          mainImage: mainImage.trim() || undefined,
          sideImages: sideImages.filter(Boolean),
          video: video.trim() || undefined,
          formata: "value", // Added formata here
        },
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleDeleteProduct = async () => {
    if (
      confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    ) {
      try {
        await deleteProductMutation.mutateAsync(productId);
        router.push(`/businesses/${businessId}/products`);
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted-foreground border-t-primary" />
          <span className="text-muted-foreground text-lg font-medium">
            Loading product...
          </span>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button and Actions */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-2 hover:bg-muted"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Product"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteProduct}
            disabled={deleteProductMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {isEditing && (
        <Alert className="mb-6">
          <AlertDescription>
            You are in edit mode. Click on any field to modify it, then save
            your changes.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image/Video */}
          <div
            className={`aspect-square bg-muted rounded-lg overflow-hidden shadow-md ${
              isEditing
                ? "border-2 border-dashed border-muted-foreground/30 hover:border-primary/50"
                : ""
            } transition-colors`}
          >
            {allMedia[selectedImage] ? (
              allMedia[selectedImage]?.includes(".mp4") ? (
                <div className="relative w-full h-full">
                  <HeroVideoDialog
                    videoSrc={allMedia[selectedImage] || "/placeholder.mp4"}
                    thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                    className="w-full h-full object-cover"
                  />
                  {!isVideoPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Button
                        size="lg"
                        className="rounded-full w-16 h-16 bg-background/90 hover:bg-background text-foreground shadow-lg"
                        onClick={() => setIsVideoPlaying(true)}
                      >
                        <Play className="h-6 w-6 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={allMedia[selectedImage] || "/placeholder.svg"}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <Upload className="h-12 w-12 mb-2" />
                <span>No Image</span>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-2">
            {/* Main Image Thumbnail */}
            <Button
              onClick={() => setSelectedImage(0)}
              className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === 0
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground"
              }`}
            >
              {mainImage ? (
                <img
                  src={mainImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center border-dashed border-muted-foreground/30">
                  <Upload className="h-4 w-4" />
                </div>
              )}
            </Button>

            {/* Video Thumbnail */}
            <Button
              onClick={() => setSelectedImage(1)}
              className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === 1 && video
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground"
              }`}
            >
              {video ? (
                <div className="relative w-full h-full">
                  <HeroVideoDialog
                    videoSrc={video}
                    thumbnailSrc=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center border-dashed border-muted-foreground/30 text-xs">
                  <Play className="h-4 w-4 mb-1" />
                  Video
                </div>
              )}
            </Button>

            {/* Side Images */}
            {sideImages.map((image, index) => (
              <Button
                key={index.toString()}
                onClick={() => setSelectedImage(index + 2)}
                className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index + 2 && image
                    ? "border-primary"
                    : "border-transparent hover:border-muted-foreground"
                }`}
              >
                {image ? (
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center border-dashed border-muted-foreground/30">
                    <Upload className="h-4 w-4" />
                  </div>
                )}
              </Button>
            ))}
          </div>

          {/* URL Inputs for Media (only in edit mode) */}
          {isEditing && (
            <div className="space-y-2">
              <Label>Media URLs</Label>
              <Input
                placeholder="Main Image URL"
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
              />
              <Input
                placeholder="Video URL"
                value={video}
                onChange={(e) => setVideo(e.target.value)}
              />
              {sideImages.map((image, index) => (
                <Input
                  key={index.toString()}
                  placeholder={`Side Image ${index + 1} URL`}
                  value={image}
                  onChange={(e) => {
                    const newSideImages = [...sideImages];
                    newSideImages[index] = e.target.value;
                    setSideImages(newSideImages);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                {isEditing ? (
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Product Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter product name"
                      className="text-3xl font-bold border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                ) : (
                  <h1 className="text-3xl font-bold text-foreground text-balance drop-shadow-sm">
                    {name}
                  </h1>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="p-2">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            {isEditing ? (
              <div>
                <Label htmlFor="price" className="text-sm font-medium">
                  Price
                </Label>
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-2">₹</span>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className="text-4xl font-bold border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-primary"
                  />
                </div>
              </div>
            ) : (
              <div className="text-4xl font-bold text-primary drop-shadow">
                {formatINR(Number(price))}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Price includes all taxes
            </p>
          </div>

          {/* Stock Status */}
          <div className="space-y-2">
            {isEditing ? (
              <div>
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Quantity Available
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  className="w-32"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${Number(quantity) > 0 ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span
                  className={`font-medium ${Number(quantity) > 0 ? "text-green-700" : "text-red-700"}`}
                >
                  {Number(quantity) > 0
                    ? `In Stock (${quantity} available)`
                    : "Out of Stock"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-16">
        <Card className="border-0 shadow-lg bg-muted">
          <CardContent className="p-8">
            {isEditing ? (
              <Tabs
                value={descriptionTab}
                onValueChange={(v: string) =>
                  setDescriptionTab(v as "edit" | "preview")
                }
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">Edit Description</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Product Description (Markdown supported)
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter product description using markdown..."
                      className="min-h-[300px] resize-none"
                    />
                    <p className="text-sm text-muted-foreground">
                      You can use markdown formatting: **bold**, *italic*, #
                      headings, - bullet points
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-4">
                  <div className="min-h-[300px] border rounded-lg p-4 bg-background">
                    {description ? (
                      <div
                        className="prose prose-slate max-w-none text-foreground"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(description),
                        }}
                      />
                    ) : (
                      <p className="text-muted-foreground italic">
                        Description preview will appear here...
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div
                className="prose prose-slate max-w-none text-foreground"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(description),
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Floating Save Button (only in edit mode) */}
      {isEditing && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={handleUpdateProduct}
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-16 h-16"
            disabled={!name.trim() || !price || updateProductMutation.isPending}
          >
            <Save className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
