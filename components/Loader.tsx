import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center py-8 space-y-4">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <style>
              {`
                .scanline {
                  animation: scan 2s linear infinite;
                }
                @keyframes scan {
                  0% { y: 15%; }
                  50% { y: 75%; }
                  100% { y: 15%; }
                }
              `}
            </style>
            <path d="M85 40C85 30 75 30 70 25C65 20 60 10 50 10C40 10 35 20 30 25C25 30 15 30 15 40C15 55 25 60 30 70L25 90H75L70 70C75 60 85 55 85 40Z"
              stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M45 45C45 45 40 50 50 50C60 50 55 45 55 45" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <line className="scanline" x1="20" x2="80" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="text-brand-textSecondary font-semibold">Analyzing traits...</p>
    </div>
  );
};