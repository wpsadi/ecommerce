import { ImageIcon, Play, Upload, Video } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";

interface MediaGalleryProps {
  mainImageFile: File | null;
  videoFile: File | null;
  sideImageFiles: (File | null)[];
  selectedImage: number;
  onMainImageFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSideImageFile: (
    index: number,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectedImageChange: (index: number) => void;
}

export function MediaGallery({
  mainImageFile,
  videoFile,
  sideImageFiles,
  selectedImage,
  onMainImageFile,
  onVideoFile,
  onSideImageFile,
  onSelectedImageChange,
}: MediaGalleryProps) {
  const mainImageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const sideImageRefs = useRef<(HTMLInputElement | null)[]>([null, null, null]);

  const getMainImagePreview = () => {
    if (mainImageFile) return URL.createObjectURL(mainImageFile);
    return "/placeholder.svg";
  };

  const getSideImagePreview = (index: number) => {
    if (sideImageFiles[index])
      return URL.createObjectURL(sideImageFiles[index]!);
    return "/placeholder.svg";
  };

  const getVideoPreview = () => {
    if (videoFile) return URL.createObjectURL(videoFile);
    return "";
  };

  // All media for gallery display
  const allMedia = [
    getMainImagePreview(),
    ...(getVideoPreview() ? [getVideoPreview()] : []),
    ...sideImageFiles
      .map((_, index) => getSideImagePreview(index))
      .filter(Boolean),
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Main Image/Video Display */}
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
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Button
                  size="lg"
                  className="rounded-full w-16 h-16 bg-background/90 hover:bg-background text-foreground shadow-lg"
                >
                  <Play className="h-6 w-6 ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            <Image
              src={allMedia[selectedImage] || "/placeholder.svg"}
              alt="Product"
              fill
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
              onSelectedImageChange(0);
              mainImageRef.current?.click();
            }}
            className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors p-0 ${
              selectedImage === 0
                ? "border-primary"
                : "border-transparent hover:border-muted-foreground"
            }`}
          >
            {getMainImagePreview() ? (
              <Image
                src={getMainImagePreview()}
                alt=""
                fill
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
            onChange={onMainImageFile}
          />
        </div>

        {/* Video Thumbnail */}
        <div className="relative">
          <Button
            onClick={() => {
              onSelectedImageChange(1);
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
            onChange={onVideoFile}
          />
        </div>

        {/* Side Images */}
        {sideImageFiles.map((_, index) => (
          <div key={index} className="relative">
            <Button
              onClick={() => {
                onSelectedImageChange(index + 2);
                sideImageRefs.current[index]?.click();
              }}
              className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors p-0 ${
                selectedImage === index + 2 && getSideImagePreview(index)
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground"
              }`}
            >
              {getSideImagePreview(index) ? (
                <Image
                  src={getSideImagePreview(index)}
                  alt=""
                  fill
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
              onChange={onSideImageFile(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
