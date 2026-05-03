import React from 'react';

// Fix: Corrected invalid function name 'R GMLogo' to 'RGMLogo'.
const RGMLogo = () => (
  <svg className="h-10 w-10 mx-auto mb-2 opacity-80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90Z" stroke="currentColor" strokeWidth="4"/>
    <path d="M60 40C60 35 55 35 52.5 32.5C50 30 47.5 25 42.5 25C37.5 25 35 30 32.5 32.5C30 35 25 35 25 40C25 47.5 30 50 32.5 55L30 65H55L52.5 55C55 50 60 47.5 60 40Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M45 42.5C45 42.5 42.5 45 42.5 47.5C42.5 50 45 47.5 45 47.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-primary text-white mt-auto">
      <div className="container mx-auto px-4 py-4 text-center">
        <RGMLogo />
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Department of Animal Husbandry & Dairying (DoAH&D). All rights reserved.
        </p>
        <p className="text-xs opacity-75 mt-1">
          Developed under the Rashtriya Gokul Mission (RGM).
        </p>
      </div>
    </footer>
  );
};