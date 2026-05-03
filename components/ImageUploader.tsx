import React, { useCallback, useRef, useState } from 'react';
import { CameraModal } from './CameraModal';

interface ImageUploaderProps {
  onImageSelect: (file: File, dataUrl: string) => void;
  imageDataUrl: string | null;
  onClearImage: () => void;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-textSecondary group-hover:text-brand-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.47 5.47 0 00-10.79 0A4.477 4.477 0 005.2 14.1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v-6m0 0l-3 3m3-3l3-3" />
    </svg>
);

const UploaderBackgroundArt = () => (
  <svg className="absolute inset-0 w-full h-full text-gray-200/50 z-0" viewBox="0 0 200 100" preserveAspectRatio="none">
    <path d="M185 45C185 35 175 35 170 30C165 25 160 15 150 15C140 15 135 25 130 30C125 35 115 35 115 45C115 60 125 65 130 75L125 95H175L170 75C175 65 185 60 185 45Z" fill="currentColor" />
  </svg>
);

// Helper function for client-side image compression and resizing.
const compressImage = (file: File): Promise<{ file: File; dataUrl: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = reject;
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIMENSION = 1280; // Set a max width/height for the image
        let { width, height } = img;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to get canvas context.'));
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        // Use JPEG for compression, with a quality of 85%
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas toBlob failed.'));
            }
            // Create a new file object with the compressed data
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve({ file: compressedFile, dataUrl });
          },
          'image/jpeg',
          0.85
        );
      };
    };
  });
};


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, imageDataUrl, onClearImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const processAndUploadFile = useCallback(async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    setIsProcessing(true);
    try {
      const { file: compressedFile, dataUrl } = await compressImage(file);
      onImageSelect(compressedFile, dataUrl);
    } catch (error) {
      console.error("Image compression failed:", error);
      // Fallback: use original file if compression fails.
      const reader = new FileReader();
      reader.onload = () => onImageSelect(file, reader.result as string);
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
    }
  }, [onImageSelect]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
     // Reset file input to allow uploading the same file again
    if(event.target) {
      event.target.value = '';
    }
  };

  const handlePhotoTaken = useCallback((blob: Blob) => {
    const photoFile = new File([blob], `capture-${Date.now()}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
    processAndUploadFile(photoFile);
  }, [processAndUploadFile]);

  const handleUploadClick = () => {
    if (isProcessing) return; // Prevent opening file dialog while processing
    fileInputRef.current?.click();
  };
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (isProcessing) return;
    const file = event.dataTransfer.files?.[0];
     if (file) {
      processAndUploadFile(file);
    }
  }, [isProcessing, processAndUploadFile]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isProcessing) return;
    setIsDragging(true);
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };
  
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClearImage();
  }


  return (
    <>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
        />
        <div 
            className={`group relative overflow-hidden border-2 border-dashed rounded-xl p-2 sm:p-4 transition-all duration-300 ${isDragging ? 'border-brand-accent bg-blue-50' : 'border-gray-300 hover:border-brand-primary'} ${isProcessing ? 'cursor-wait' : 'cursor-pointer'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            {isDragging && (
              <div className="absolute inset-0 bg-brand-accent/20 rounded-xl flex items-center justify-center z-20">
                <p className="font-bold text-brand-accent text-lg">Drop the image here</p>
              </div>
            )}
            {imageDataUrl ? (
                <div onClick={handleUploadClick} className="text-center relative group/preview overflow-hidden rounded-lg">
                    <img src={imageDataUrl} alt="Preview" className="max-h-72 sm:max-h-80 mx-auto rounded-lg shadow-md transition-transform duration-300 ease-in-out group-hover/preview:scale-105" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <p className="text-lg text-white font-semibold">Choose another image</p>
                    </div>
                     <button onClick={handleRemoveClick} className="absolute top-2 right-2 z-10 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/80 transition-all duration-200" aria-label="Remove image">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="relative text-center flex flex-col items-center justify-center py-6 sm:py-10 min-h-[280px] sm:min-h-[320px]">
                    {isProcessing ? (
                        <div className="flex flex-col items-center justify-center text-center">
                            <svg className="animate-spin h-12 w-12 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-3 font-semibold text-brand-textPrimary">Processing image...</p>
                            <p className="text-sm text-brand-textSecondary">Resizing and compressing for analysis.</p>
                        </div>
                    ) : (
                        <>
                            <UploaderBackgroundArt />
                            <div className="relative z-10">
                              <div onClick={handleUploadClick}>
                                <UploadIcon />
                                <p className="mt-2 font-semibold text-brand-textPrimary">
                                  <span className="text-brand-accent">Click to upload</span> or drag & drop
                                </p>
                                <p className="text-sm text-brand-textSecondary">PNG, JPG, or WEBP</p>
                              </div>
                              <div className="my-4 text-center text-sm font-semibold text-gray-400">OR</div>
                              <button
                                onClick={() => setIsCameraOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary-dark text-white font-semibold text-sm rounded-lg shadow-md hover:bg-brand-primary-dark/90 focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:scale-105 active:animate-button-press transition-all duration-300"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M2 6a2 2 0 012-2h1.586a1 1 0 00.707-.293l.828-.828A1 1 0 018.121 2h3.758a1 1 0 01.707.293l.828.828a1 1 0 00.707.293H16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                  <path d="M15 8a1 1 0 10-2 0v2a1 1 0 102 0V8z" />
                                </svg>
                                <span>Use Camera</span>
                              </button>
                            </div>
                            <div className="relative z-10 mt-6 pt-4 border-t border-dashed border-gray-300 w-full max-w-md mx-auto">
                              <div className="flex items-start gap-3 text-xs text-brand-textSecondary text-left">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                  <h5 className="font-bold text-brand-textPrimary">Photo Guidelines for Accurate Analysis:</h5>
                                  <ul className="list-disc list-inside mt-1 space-y-1">
                                    <li>Use a clear, side-profile photo of the animal.</li>
                                    <li>Ensure the animal is standing on level ground.</li>
                                    <li>Good, even lighting is crucial for visibility.</li>
                                    <li>Capture the entire body, from head to tail, in the frame.</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
      <CameraModal 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
        onPhotoTaken={handlePhotoTaken} 
      />
    </>
  );
};