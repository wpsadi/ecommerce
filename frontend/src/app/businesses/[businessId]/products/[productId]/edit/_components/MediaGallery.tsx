import { ImageIcon, Play, Upload, Video } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useRef } from "react";

interface MediaGalleryProps {
  mainImageFile: File | null;
  mainImageUrl: string;
  videoFile: File | null;
  videoUrl: string;
  sideImageFiles: (File | null)[];
  sideImageUrls: string[];
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
  mainImageUrl,
  videoFile,
  videoUrl,
  sideImageFiles,
  sideImageUrls,
  selectedImage,
  onMainImageFile,
  onVideoFile,
  onSideImageFile,
  onSelectedImageChange,
}: MediaGalleryProps) {
  const mainImageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const maxSideImages = Math.max(
    sideImageFiles.length,
    sideImageUrls.length,
    3,
  );
  const sideImageRefs = useRef<(HTMLInputElement | null)[]>(
    Array(maxSideImages).fill(null),
  );

  const getMainImagePreview = () => {
    if (mainImageFile) return URL.createObjectURL(mainImageFile);
    if (mainImageUrl) return `${mainImageUrl}`;
    return "/placeholder.svg";
  };

  const getSideImagePreview = (index: number) => {
    if (sideImageFiles[index])
      return URL.createObjectURL(sideImageFiles[index]);
    if (sideImageUrls[index]) return `${sideImageUrls[index]}`;
    return "/placeholder.svg";
  };

  const getVideoPreview = () => {
    if (videoFile) return URL.createObjectURL(videoFile);
    if (videoUrl) return `${videoUrl}`;
    return "";
  };

  // All media for gallery display
  const allMedia = [
    getMainImagePreview(),
    ...(getVideoPreview() ? [getVideoPreview()] : []),
    ...Array.from({ length: maxSideImages })
      .map((_, index) => getSideImagePreview(index))
      .filter(Boolean),
  ].filter(Boolean);

  return (
    <div>
      {/* Main Image Display with Video Support */}
      <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
        {allMedia.length > 0 && allMedia[selectedImage] ? (
          videoFile && selectedImage === 0 ? (
            <div className="relative w-full h-full">
              <video
                src={getVideoPreview()}
                className="w-full h-full object-cover"
                controls
              />
            </div>
          ) : (
            <Image
              src={allMedia[selectedImage] || "/placeholder.svg"}
              alt="Product"
              fill
              className="object-cover"
            />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Upload className="h-12 w-12 mb-2" />
            <span>Upload product images</span>
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      <div className="p-4 border-t">
        <div className="grid grid-cols-4 gap-2">
          {/* Main Image Thumbnail */}
          <div
            className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${
              selectedImage === 0 ? "border-primary" : "border-transparent"
            }`}
            onClick={() => onSelectedImageChange(0)}
          >
            {mainImageFile || mainImageUrl ? (
              <Image
                src={getMainImagePreview()}
                alt=""
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-xs text-gray-400">
                <ImageIcon className="h-4 w-4 mb-1" />
                <span>Main</span>
              </div>
            )}
            <input
              type="file"
              ref={mainImageRef}
              onChange={onMainImageFile}
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {/* Video Thumbnail (if video exists) */}
          {(videoFile || videoUrl) && (
            <div
              className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${
                selectedImage === 0 && videoFile
                  ? "border-primary"
                  : "border-transparent"
              }`}
              onClick={() => onSelectedImageChange(0)}
            >
              <div className="w-full h-full flex items-center justify-center bg-black">
                <video src={getVideoPreview()} className="w-8 h-8" muted />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="absolute bottom-1 left-1 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                <Video className="h-4 w-4 mb-1" />
                <span>Video</span>
              </div>
            </div>
          )}

          {/* Video Upload Slot (if no video) */}
          {!videoFile && !videoUrl && (
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400">
              <div className="w-full h-full flex flex-col items-center justify-center text-xs text-gray-400">
                <Video className="h-4 w-4 mb-1" />
                <span>Video</span>
              </div>
              <input
                type="file"
                ref={videoRef}
                onChange={onVideoFile}
                accept="video/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          )}

          {/* Side Images */}
          {Array.from({ length: maxSideImages }).map((_, index) => (
            <div
              key={`side-${index}`}
              className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${
                selectedImage === index + 1
                  ? "border-primary"
                  : "border-transparent"
              }`}
              onClick={() => onSelectedImageChange(index + 1)}
            >
              {sideImageFiles[index] || sideImageUrls[index] ? (
                <Image
                  src={getSideImagePreview(index)}
                  alt=""
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-xs text-gray-400">
                  <ImageIcon className="h-4 w-4 mb-1" />
                  <span>+</span>
                </div>
              )}
              <input
                type="file"
                ref={(el) => {
                  sideImageRefs.current[index] = el;
                }}
                onChange={onSideImageFile(index)}
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
