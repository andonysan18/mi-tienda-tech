"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-xl overflow-hidden border border-white/10 bg-zinc-800">
            <div className="z-10 absolute top-2 right-2">
              <button type="button" onClick={() => onRemove(url)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors shadow-md">
                <Trash className="h-4 w-4" />
              </button>
            </div>
            <img className="object-cover w-full h-full" alt="Image" src={url} />
          </div>
        ))}
      </div>

      <CldUploadWidget 
        onSuccess={onUpload}
        uploadPreset="mi_tienda_preset"  // 1. TU PRESET
        options={{
          maxFiles: 1,
          cloudName: "dwjruuiu7" // 2. TU CLOUD NAME FORZADO AQUÍ
        }}
      >
        {({ open }) => {
          return (
            <button 
              type="button" 
              disabled={disabled} 
              onClick={() => open()}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-xl border border-white/10 transition-all font-medium text-sm"
            >
              <ImagePlus className="h-4 w-4" />
              Subir Imagen
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}

export default ImageUpload;