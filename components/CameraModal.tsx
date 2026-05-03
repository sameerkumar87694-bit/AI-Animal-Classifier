import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoTaken: (blob: Blob) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onPhotoTaken }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [isStarting, setIsStarting] = useState(true);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startStream = useCallback(async (deviceId?: string) => {
    stopCamera();
    setError(null);
    setIsStarting(true);
    try {
      const constraints = { video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'environment' } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') setError('Camera permission was denied. Please allow camera access in your browser settings.');
        else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') setError('No camera was found on this device.');
        else if (err.name === 'NotReadableError') setError('The camera is already in use by another application.');
        else setError('Could not access the camera due to a hardware error.');
      } else {
        setError('An unknown error occurred while accessing the camera.');
      }
    } finally {
      setIsStarting(false);
    }
  }, [stopCamera]);

  useEffect(() => {
    if (isOpen) {
      const setupCamera = async () => {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter(d => d.kind === 'videoinput');
          setVideoDevices(videoInputs);

          if (videoInputs.length > 0) {
            const backCameraIndex = videoInputs.findIndex(d => d.label.toLowerCase().includes('back'));
            const initialIndex = backCameraIndex !== -1 ? backCameraIndex : 0;
            setCurrentDeviceIndex(initialIndex);
            startStream(videoInputs[initialIndex].deviceId);
          } else {
            // Fallback for devices that don't allow enumeration before permission
            startStream();
          }
        } catch (err) {
          console.error("Could not enumerate devices:", err);
          setError('Could not list available cameras. Attempting to use default.');
          startStream();
        }
      };
      setupCamera();
    } else {
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (videoDevices.length > 0) {
      startStream(videoDevices[currentDeviceIndex].deviceId);
    } else {
      startStream();
    }
  };

  const handleUsePhoto = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          onPhotoTaken(blob);
          onClose();
        }
      }, 'image/jpeg', 0.9);
    }
  };
  
  const handleSwitchCamera = () => {
    if (videoDevices.length > 1) {
        const newIndex = (currentDeviceIndex + 1) % videoDevices.length;
        setCurrentDeviceIndex(newIndex);
        startStream(videoDevices[newIndex].deviceId);
    }
  };


  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in-up"
      style={{ animationDuration: '0.3s' }}
    >
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col overflow-hidden relative">
        <h2 className="text-xl font-bold text-white text-center py-3">Camera Capture</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full text-white/70 hover:bg-white/20 hover:text-white transition-colors z-20"
          aria-label="Close camera"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex-grow bg-black flex items-center justify-center relative">
          {error ? (
            <div className="text-center text-red-400 p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <h3 className="font-bold text-lg">Camera Error</h3>
              <p className="text-sm mt-2">{error}</p>
            </div>
          ) : isStarting ? (
             <svg className="animate-spin h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-contain ${capturedImage ? 'hidden' : 'block'}`}
              />
              <canvas
                ref={canvasRef}
                className={`w-full h-full object-contain ${capturedImage ? 'block' : 'hidden'}`}
              />
            </>
          )}
        </div>
        
        <div className="flex-shrink-0 bg-gray-900/50 p-4 flex items-center justify-center gap-6 h-[100px]">
            {capturedImage ? (
                <>
                    <button onClick={handleRetake} className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-lg hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-400 transform hover:scale-105 transition-all duration-300">Retake</button>
                    <button onClick={handleUsePhoto} className="px-6 py-3 bg-brand-accent text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105 transition-all duration-300">Use Photo</button>
                </>
            ) : (
                <div className="w-full flex items-center justify-around">
                    <div className="w-16 h-16"></div> {/* Spacer */}
                    <button onClick={handleCapture} disabled={!!error || isStarting} className="w-16 h-16 bg-white rounded-full flex items-center justify-center ring-4 ring-white/30 hover:ring-white/60 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <div className="w-14 h-14 bg-white rounded-full border-4 border-gray-900"></div>
                    </button>
                    <div className="w-16 h-16 flex items-center justify-center">
                        {videoDevices.length > 1 && (
                            <button onClick={handleSwitchCamera} className="p-3 rounded-full text-white/70 hover:bg-white/20 hover:text-white transition-colors" aria-label="Switch camera">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.13-6.36M20 15a9 9 0 01-14.13 6.36" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
