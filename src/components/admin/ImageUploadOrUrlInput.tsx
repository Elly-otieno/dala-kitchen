import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, X, CheckCircle2 } from 'lucide-react';

interface ImageUploadOrUrlInputProps {
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
  placeholder?: string;
  aspectRatioClass?: string;
}

export const ImageUploadOrUrlInput: React.FC<ImageUploadOrUrlInputProps> = ({
  value,
  onChange,
  label = 'Image',
  placeholder = 'https://images.unsplash.com/... or upload image',
  aspectRatioClass = 'h-48',
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const maxDim = 1200;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG at 0.84 quality to keep payload small (~100kb) and persistable
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.84);
          resolve(compressedDataUrl);
        };
        img.onerror = () => {
          resolve(readerEvent.target?.result as string);
        };
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    try {
      setIsProcessing(true);
      const compressedBase64 = await compressImage(file);
      onChange(compressedBase64);
    } catch (err) {
      console.error('Error processing image:', err);
      // Fallback to direct FileReader if canvas fails
      const fallbackReader = new FileReader();
      fallbackReader.onload = () => {
        if (typeof fallbackReader.result === 'string') {
          onChange(fallbackReader.result);
        }
      };
      fallbackReader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-[#e6e2dc] space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#1b1c1c]">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-[#f4f1eb] p-0.5 rounded-lg border border-[#e6e2dc]">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'upload'
                ? 'bg-[#27331c] text-white shadow-2xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Upload size={12} /> Upload / Drop
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'url'
                ? 'bg-[#27331c] text-white shadow-2xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <LinkIcon size={12} /> Image URL
          </button>
        </div>
      </div>

      {/* Image Preview Window */}
      <div className={`w-full ${aspectRatioClass} rounded-2xl overflow-hidden bg-[#f8f6f3] border border-[#e6e2dc] relative group flex items-center justify-center`}>
        {value ? (
          <>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Image fallback
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white/90 hover:bg-white text-black text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Upload size={14} /> Change Image
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-all cursor-pointer"
                title="Clear Image"
              >
                <X size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center p-6 text-gray-400 flex flex-col items-center gap-2">
            <ImageIcon size={32} className="text-gray-300" />
            <p className="text-xs font-medium">No image selected</p>
          </div>
        )}
      </div>

      {/* Input Controls */}
      {activeMode === 'upload' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#27331c] bg-[#f4f8f1]'
              : 'border-[#d8d3cb] bg-[#fcf9f8] hover:bg-[#f4f1eb] hover:border-[#27331c]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <div className="w-10 h-10 rounded-full bg-white border border-[#e6e2dc] flex items-center justify-center text-[#27331c]">
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-[#27331c] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload size={18} />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-[#1b1c1c]">
                {isProcessing ? 'Optimizing & saving image...' : 'Click to upload'} <span className="font-normal text-gray-500">{!isProcessing && 'or drag and drop'}</span>
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, WEBP — auto-optimized for permanent local storage</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#fcf9f8] border border-[#e6e2dc] rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none focus:border-[#27331c] focus:bg-white"
          />
        </div>
      )}
    </div>
  );
};
