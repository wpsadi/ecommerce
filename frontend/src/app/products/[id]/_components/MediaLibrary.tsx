import { ImageIcon, Play, Upload } from "lucide-react";
import { default as NextImage } from "next/image";

interface MediaLibraryProps {
  mainImageUrl: string;
  videoUrl: string;
  sideImageUrls: string[];
  selectedImage: number;
  productName: string;
  onImageSelect: (index: number) => void;
}

export function MediaLibrary({
  mainImageUrl,
  videoUrl,
  sideImageUrls,
  selectedImage,
  productName,
  onImageSelect,
}: MediaLibraryProps) {
  const getMainImagePreview = () => {
    if (mainImageUrl) return mainImageUrl;
    return "/placeholder.svg";
  };

  const getSideImagePreview = (index: number) => {
    if (sideImageUrls[index]) return sideImageUrls[index];
    return "/placeholder.svg";
  };

  const getVideoPreview = () => {
    if (videoUrl) return videoUrl;
    return "";
  };

  // All media for gallery display (only existing media)
  const allMedia = [
    getMainImagePreview(),
    ...(getVideoPreview() ? [getVideoPreview()] : []),
    ...sideImageUrls.filter(Boolean),
  ].filter(Boolean);

  const isVideo = (url: string) => url?.includes(".mp4");

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      {/* Main Image Display with Video Support */}
      <div className="relative aspect-square bg-muted rounded-t-lg overflow-hidden">
        {allMedia.length > 0 && allMedia[selectedImage] ? (
          isVideo(allMedia[selectedImage]) ? (
            <div className="relative w-full h-full">
              <video
                src={getVideoPreview()}
                className="w-full h-full object-cover"
                controls
              />
            </div>
          ) : (
            <NextImage
              src={allMedia[selectedImage] || "/placeholder.svg"}
              alt={productName}
              fill
              className="object-cover"
            />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <Upload className="h-12 w-12 mb-2" />
            <span>No product images</span>
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-4 gap-2">
          {/* Main Image Thumbnail */}
          <div
            className={`relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
              selectedImage === 0
                ? "border-primary"
                : "border-border hover:border-muted-foreground"
            }`}
            onClick={() => onImageSelect(0)}
          >
            {mainImageUrl ? (
              <NextImage
                src={getMainImagePreview()}
                alt=""
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-xs text-muted-foreground">
                <ImageIcon className="h-4 w-4 mb-1" />
                <span>Main</span>
              </div>
            )}
          </div>

          {/* Video Thumbnail (if video exists) */}
          {videoUrl && (
            <div
              className={`relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                selectedImage === 1 && videoUrl
                  ? "border-primary"
                  : "border-border hover:border-muted-foreground"
              }`}
              onClick={() => onImageSelect(1)}
            >
              <div className="w-full h-full flex items-center justify-center bg-black">
                <video
                  src={getVideoPreview()}
                  className="w-full h-full object-cover"
                  muted
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="absolute bottom-1 left-1 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                Video
              </div>
            </div>
          )}

          {/* Side Images (only show existing ones) */}
          {sideImageUrls.map((imageUrl, index) => {
            if (!imageUrl) return null;
            const mediaIndex = videoUrl ? index + 2 : index + 1;
            return (
              <div
                key={`side-${index}`}
                className={`relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                  selectedImage === mediaIndex
                    ? "border-primary"
                    : "border-border hover:border-muted-foreground"
                }`}
                onClick={() => onImageSelect(mediaIndex)}
              >
                <NextImage
                  src={getSideImagePreview(index)}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
