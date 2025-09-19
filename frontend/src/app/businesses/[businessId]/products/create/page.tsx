"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateProduct } from "../_hooks/createProduct";
import { DescriptionEditor } from "./_components/DescriptionEditor";
import { FloatingCreateButton } from "./_components/FloatingCreateButton";
import { MediaGallery } from "./_components/MediaGallery";
import { ProductInfoForm } from "./_components/ProductInfoForm";

export default function CreateProductPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.businessId as string;

  // State for form data
  const [name, setName] = useState( "" );
  const [price, setPrice] = useState( "" );
  const [quantity, setQuantity] = useState( "" );
  const [description, setDescription] = useState( "" );

  // Media state - all images (main + side) and video
  const [mainImage, setMainImage] = useState<File | null>( null );
  const [mainImageUrl] = useState<string>( "" );
  const [sideImages, setSideImages] = useState<( File | null )[]>( [
    null,
    null,
    null,
  ] );
  const [sideImageUrls] = useState<string[]>( [] );
  const [video, setVideo] = useState<File | null>( null );
  const [videoUrl] = useState<string>( "" );

  // UI state
  const [selectedImage, setSelectedImage] = useState( 0 );
  const [descriptionTab, setDescriptionTab] = useState<"edit" | "preview">(
    "edit",
  );

  const { mutate: createProduct, isPending } = useCreateProduct();

  // Media handlers
  const handleMainImageFile = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    const file = e.target.files?.[0];
    if ( file ) {
      setMainImage( file );
    }
  };

  const handleVideoFile = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    const file = e.target.files?.[0];
    if ( file ) {
      setVideo( file );
    }
  };

  const handleSideImageFile =
    ( index: number ) => ( e: React.ChangeEvent<HTMLInputElement> ) => {
      const file = e.target.files?.[0];
      if ( file ) {
        const newSideImages = [...sideImages];
        newSideImages[index] = file;
        setSideImages( newSideImages );
      }
    };



  // Handle create button click
  const handleCreateClick = () => {
    handleSubmit( { preventDefault: () => { } } as React.FormEvent );
  };

  // Submit handler
  const handleSubmit = ( e: React.FormEvent ) => {
    e.preventDefault();

    if ( !name || !price || !quantity ) {
      alert( "Please fill in all required fields" );
      return;
    }

    const formData = new FormData();
    formData.append( "businessId", businessId );
    formData.append( "name", name );
    formData.append( "price", price );
    formData.append( "quantity", quantity );
    formData.append( "description", description );

    // Add files only (match edit page keys)
    if ( mainImage ) {
      formData.append( "mainImage", mainImage );
    }
    sideImages.forEach( ( img ) => {
      if ( img ) {
        formData.append( "sideImages", img );
      }
    } );
    if ( video ) {
      formData.append( "video", video );
    }

    createProduct( formData, {
      onSuccess: () => {
        router.push( `/businesses/${businessId}/products` );
      },
    } );
  };

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
                onClick={() =>
                  router.push( `/businesses/${businessId}/products` )
                }
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-foreground">
                Create Product
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Media Gallery */}
            <div>
              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4 text-foreground">
                    Product Media
                  </h2>
                  <MediaGallery
                    mainImageFile={mainImage}
                    mainImageUrl={mainImageUrl}
                    videoFile={video}
                    videoUrl={videoUrl}
                    sideImageFiles={sideImages}
                    sideImageUrls={sideImageUrls}
                    selectedImage={selectedImage}
                    onMainImageFile={handleMainImageFile}
                    onVideoFile={handleVideoFile}
                    onSideImageFile={handleSideImageFile}
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

          <FloatingCreateButton
            onClick={handleCreateClick}
            disabled={!name || !price || !quantity}
            isLoading={isPending}
          />
        </form>
      </div>
    </div>
  );
}
