import Image from "next/image";
import React from "react";

interface EditableImageProps {
  src?: string;
  alt?: string;
  onChange: (file: File | null) => void;
  onDelete?: () => void;
  placeholder?: string;
  strike?: boolean;
}

export function EditableImage({
  src,
  alt,
  onChange,
  onDelete,
  placeholder = "Upload Image",
  strike = false,
}: EditableImageProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div
      className={`relative group w-32 h-32 rounded-lg overflow-hidden border ${strike ? "opacity-60 grayscale" : "hover:shadow-lg"}`}
      style={{ cursor: "pointer" }}
      onClick={() => fileInputRef.current?.click()}
    >
      {src ? (
        <Image src={src} alt={alt || "Product preview image"} fill />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
          {placeholder}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) onChange(e.target.files[0]);
        }}
      />
      {src && onDelete && !strike && (
        <button
          type="button"
          className="absolute top-1 right-1 bg-destructive/80 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
