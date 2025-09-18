"use client";

import {
  ArrowLeft,
  Heart,
  ImageIcon,
  Play,
  Save,
  Share2,
  Upload,
  Video,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProduct } from "../_hooks/createProduct";

export default function CreateProductPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.businessId as string;

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  // File states
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [sideImageFiles, setSideImageFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);
  const [sideImageUrls, setSideImageUrls] = useState<string[]>(["", "", ""]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Description tabs
  const [descriptionTab, setDescriptionTab] = useState<"edit" | "preview">(
    "edit",
  );
  const [isLoading, setIsLoading] = useState(false);

  // File refs
  const mainImageRef = useRef<HTMLInputElement>(null);
  const sideImageRefs = useRef<(HTMLInputElement | null)[]>([null, null, null]);
  const videoRef = useRef<HTMLInputElement>(null);

  const createProductMutation = useCreateProduct();

  // Get preview URLs for display
  const getMainImagePreview = () => {
    if (mainImageFile) return URL.createObjectURL(mainImageFile);
    return mainImageUrl;
  };

  const getSideImagePreview = (index: number) => {
    if (sideImageFiles[index])
      return URL.createObjectURL(sideImageFiles[index]!);
    return sideImageUrls[index];
  };

  const getVideoPreview = () => {
    if (videoFile) return URL.createObjectURL(videoFile);
    return videoUrl;
  };

  const allMedia = [
    getMainImagePreview(),
    ...(getVideoPreview() ? [getVideoPreview()] : []),
    ...sideImageUrls
      .map((_, index) => getSideImagePreview(index))
      .filter(Boolean),
  ].filter(Boolean);

  // File handlers
  const handleMainImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      setMainImageUrl(""); // Clear URL when file is selected
    }
  };

  const handleSideImageFile =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const newFiles = [...sideImageFiles];
        newFiles[index] = file;
        setSideImageFiles(newFiles);

        // Clear URL when file is selected
        const newUrls = [...sideImageUrls];
        newUrls[index] = "";
        setSideImageUrls(newUrls);
      }
    };

  const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(""); // Clear URL when file is selected
    }
  };

  const handleSideImageUrl = (index: number, url: string) => {
    const newUrls = [...sideImageUrls];
    newUrls[index] = url;
    setSideImageUrls(newUrls);

    // Clear file when URL is entered
    if (url) {
      const newFiles = [...sideImageFiles];
      newFiles[index] = null;
      setSideImageFiles(newFiles);
    }
  };

  const handleCreateProduct = async () => {
    if (!name.trim() || !price) return;

    setIsLoading(true);
    try {
      const formData = new FormData();

      // Add text fields
      formData.append("name", name.trim());
      formData.append("price", price);
      formData.append("quantity", quantity || "0");
      formData.append("businessId", businessId);
      if (description.trim())
        formData.append("description", description.trim());

      // Add files
      if (mainImageFile) formData.append("mainImage", mainImageFile);
      else if (mainImageUrl.trim())
        formData.append("mainImageUrl", mainImageUrl.trim());

      if (videoFile) formData.append("video", videoFile);
      else if (videoUrl.trim()) formData.append("videoUrl", videoUrl.trim());

      // Add side images
      sideImageFiles.forEach((file, index) => {
        if (file) formData.append("sideImages", file);
        else if (sideImageUrls[index]?.trim())
          formData.append(`sideImageUrl${index}`, sideImageUrls[index]);
      });

      await createProductMutation.mutateAsync(formData);

      // Redirect to products list on success
      router.push(`/businesses/${businessId}/products`);
    } catch (error) {
      console.error("Failed to create product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image/Video */}
            <div className="aspect-square bg-muted rounded-lg overflow-hidden shadow-md">
              {allMedia[selectedImage] ? (
                allMedia[selectedImage]?.includes(".mp4") ||
                getVideoPreview() === allMedia[selectedImage] ? (
                  <div className="relative w-full h-full">
                    <HeroVideoDialog
                      className="w-full h-full object-cover"
                      animationStyle="from-center"
                      videoSrc={allMedia[selectedImage] || "/placeholder.mp4"}
                      thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                      thumbnailAlt="Product Video"
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
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-muted-foreground/30">
                  <Upload className="h-12 w-12 mb-2" />
                  <span>Click thumbnails to upload media</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {/* Main Image Thumbnail */}
              <div className="relative">
                <Button
                  onClick={() => {
                    setSelectedImage(0);
                    mainImageRef.current?.click();
                  }}
                  className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors p-0 ${
                    selectedImage === 0
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                >
                  {getMainImagePreview() ? (
                    <img
                      src={getMainImagePreview()}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center border-dashed border-muted-foreground/30 text-xs">
                      <ImageIcon className="h-4 w-4 mb-1" />
                      Main
                    </div>
                  )}
                </Button>
                <input
                  ref={mainImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMainImageFile}
                />
              </div>

              {/* Video Thumbnail */}
              <div className="relative">
                <Button
                  onClick={() => {
                    setSelectedImage(1);
                    videoRef.current?.click();
                  }}
                  className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors p-0 ${
                    selectedImage === 1 && getVideoPreview()
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                >
                  {getVideoPreview() ? (
                    <div className="relative w-full h-full">
                      <HeroVideoDialog
                        videoSrc={getVideoPreview()}
                        className="w-full h-full object-cover"
                        thumbnailSrc={""}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center border-dashed border-muted-foreground/30 text-xs">
                      <Video className="h-4 w-4 mb-1" />
                      Video
                    </div>
                  )}
                </Button>
                <input
                  ref={videoRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoFile}
                />
              </div>

              {/* Side Images */}
              {sideImageFiles.map((_, index) => (
                <div key={index.toString()} className="relative">
                  <Button
                    onClick={() => {
                      setSelectedImage(index + 2);
                      sideImageRefs.current[index]?.click();
                    }}
                    className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors p-0 ${
                      selectedImage === index + 2 && getSideImagePreview(index)
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground"
                    }`}
                  >
                    {getSideImagePreview(index) ? (
                      <img
                        src={getSideImagePreview(index)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center border-dashed border-muted-foreground/30 text-xs">
                        <ImageIcon className="h-4 w-4 mb-1" />
                        Side {index + 1}
                      </div>
                    )}
                  </Button>
                  <input
                    ref={(el) => {
                      sideImageRefs.current[index] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleSideImageFile(index)}
                  />
                </div>
              ))}
            </div>

            {/* URL Inputs for Media */}
            <div className="space-y-2">
              <Label>Or enter URLs</Label>
              <Input
                placeholder="Main Image URL"
                value={mainImageUrl}
                onChange={(e) => {
                  setMainImageUrl(e.target.value);
                  if (e.target.value) setMainImageFile(null);
                }}
              />
              <Input
                placeholder="Video URL"
                value={videoUrl}
                onChange={(e) => {
                  setVideoUrl(e.target.value);
                  if (e.target.value) setVideoFile(null);
                }}
              />
              {sideImageUrls.map((url, index) => (
                <Input
                  key={index.toString()}
                  placeholder={`Side Image ${index + 1} URL`}
                  value={url}
                  onChange={(e) => handleSideImageUrl(index, e.target.value)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
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
              <p className="text-sm text-muted-foreground">
                Price includes all taxes
              </p>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
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
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-16">
          <Card className="border-0 shadow-lg bg-muted">
            <CardContent className="p-8">
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
                      <div className="prose prose-slate max-w-none text-foreground">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                        >
                          {description}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Description preview will appear here...
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Floating Create Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={handleCreateProduct}
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-16 h-16"
            disabled={
              !name.trim() ||
              !price ||
              isLoading ||
              createProductMutation.isPending
            }
          >
            <Save className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
