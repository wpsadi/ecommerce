"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetProduct } from "../../_hooks/getProduct";
import { useDeleteProduct, useUpdateProduct } from "../../_hooks/updateProduct";
import { DescriptionEditor } from "./_components/DescriptionEditor";
import { FloatingActionButtons } from "./_components/FloatingActionButtons";
import { MediaGallery } from "./_components/MediaGallery";
import { ProductInfoForm } from "./_components/ProductInfoForm";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.businessId as string;
  const productId = params.productId as string;

  const { data: product, isPending: isLoadingProduct } =
    useGetProduct(productId);
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  // State for form data
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  // Media state - files for new uploads
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [sideImageFiles, setSideImageFiles] = useState<(File | null)[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Existing media URLs from the server
  const [mainImageUrl, _setMainImageUrl] = useState("");
  const [sideImageUrls, setSideImageUrls] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");

  // UI state
  const [selectedImage, setSelectedImage] = useState(0);
  const [descriptionTab, setDescriptionTab] = useState<"edit" | "preview">(
    "edit",
  );

  // Load product data when component mounts
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPrice(product.price?.toString() || "");
      setQuantity(product.quantity?.toString() || "");
      setDescription(product.description || "");

      // Helper to fetch a URL as a File
      const fetchAsFile = async (
        url: string,
        filename: string,
        mimeType: string,
      ): Promise<File | null> => {
        if (!url) return null;
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          return new File([blob], filename, { type: mimeType });
        } catch {
          return null;
        }
      };

      // Fetch and set main image as File
      if (product.mainImage) {
        fetchAsFile(product.mainImage, "mainImage.jpg", "image/jpeg").then(
          (file) => {
            if (file) setMainImageFile(file);
          },
        );
      }

      // Fetch and set side images as Files (dynamic count)
      if (product.sideImages && Array.isArray(product.sideImages)) {
        setSideImageUrls(product.sideImages);
        Promise.all(
          product.sideImages.map((url: string, idx: number) =>
            url
              ? fetchAsFile(url, `sideImage${idx + 1}.jpg`, "image/jpeg")
              : Promise.resolve(null),
          ),
        ).then((files) => {
          setSideImageFiles(files);
        });
      } else {
        setSideImageFiles([]);
        setSideImageUrls([]);
      }

      // For video, do NOT fetch as blob. Just keep the URL for preview.
      setVideoUrl(product.video || "");
      setVideoFile(null);
    }
  }, [product]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Valid price is required");
      return;
    }
    if (!quantity || Number(quantity) < 0) {
      toast.error("Valid quantity is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("description", description);
      formData.append("businessId", businessId);

      // Only send files if present (never send URLs or 'existing...' fields)
      if (mainImageFile) {
        formData.append("mainImage", mainImageFile);
      }
      sideImageFiles.forEach((file) => {
        if (file) {
          formData.append("sideImages", file);
        }
      });
      // Only send video if user uploaded a new one
      if (videoFile) {
        formData.append("video", videoFile);
      }

      updateProduct(
        {
          productId,
          formData,
        },
        {
          onSuccess: () => {
            toast.success("Product updated successfully");
            router.push(`/businesses/${businessId}/products`);
          },
          onError: (error) => {
            console.error("Update error:", error);
            toast.error("Failed to update product");
          },
        },
      );
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save product");
    }
  };

  const handleDelete = () => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    ) {
      return;
    }
    deleteProduct(productId, {
      onSuccess: () => {
        toast.success("Product deleted successfully");
        router.push(`/businesses/${businessId}/products`);
      },
      onError: () => {
        toast.error("Failed to delete product");
      },
    });
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-foreground">
                Edit Product
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Media Gallery */}
          <div>
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">
                  Product Media
                </h2>
                <MediaGallery
                  mainImageFile={mainImageFile}
                  mainImageUrl={mainImageUrl}
                  videoFile={videoFile}
                  videoUrl={videoUrl}
                  sideImageFiles={sideImageFiles}
                  sideImageUrls={sideImageUrls}
                  selectedImage={selectedImage}
                  onMainImageFile={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setMainImageFile(file);
                  }}
                  onVideoFile={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setVideoFile(file);
                  }}
                  onSideImageFile={(index) => (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const newFiles = [...sideImageFiles];
                      newFiles[index] = file;
                      setSideImageFiles(newFiles);
                    }
                  }}
                  onSelectedImageChange={setSelectedImage}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Product Information */}
          <div className="space-y-6">
            {/* Product Info Form */}
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">
                  Product Information
                </h2>
                <ProductInfoForm
                  name={name}
                  price={price}
                  quantity={quantity}
                  onNameChange={setName}
                  onPriceChange={setPrice}
                  onQuantityChange={setQuantity}
                />
              </CardContent>
            </Card>

            {/* Description Editor */}
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">
                  Product Description
                </h2>
                <DescriptionEditor
                  description={description}
                  descriptionTab={descriptionTab}
                  onDescriptionChange={setDescription}
                  onTabChange={setDescriptionTab}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <FloatingActionButtons
        onSave={handleSave}
        onDelete={handleDelete}
        isLoading={isUpdating}
        disabled={isDeleting}
      />
    </div>
  );
}
