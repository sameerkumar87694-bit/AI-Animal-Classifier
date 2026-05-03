import React from 'react';

export const AuthIllustration: React.FC = () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-center">
        <svg viewBox="0 0 200 200" className="w-full h-auto max-w-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M159.2 88.4c0-23-17-43.2-39.6-47.2-2.8-23-23.8-41.2-47.6-41.2-26.4 0-48 21.6-48 48 0 4.4 1.2 8.4 2.4 12.4-20.4 6.8-34.4 26.8-34.4 50 0 29.2 23.6 52.8 52.8 52.8h110C135.6 141.2 159.2 117.6 159.2 88.4z" fill="#E0F2F1"/>
            <path d="M157.5 87.5c0-13-8.5-24.5-20.5-28.5m-56-54c-25.5 0-46.5 21-46.5 46.5 0 3 .5 6.5 1.5 9.5-22.5 7.5-38.5 29.5-38.5 54.5 0 31.5 25.5 57 57 57h114.5c22.5-4.5 40-24 40-47.5s-18-43-40-47.5c-3-22.5-23-40-46-40z" stroke="#065f46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M117 144.5L111 114.5c-4.167-3.333-10-6.5-16.5-4.5-6.5 2-10.167 7.667-11.5 12l-6 22.5h39.5z" stroke="#065f46" strokeWidth="3" strokeLinejoin="round"/>
            <path d="M72 144.5L69.5 124c-3.167-.833-8-1-12 1-4 2-7 6-8 9l-6 10.5h34.5z" stroke="#065f46" strokeWidth="3" strokeLinejoin="round"/>
            <path d="M111.5 114.5C104.5 102.5 104.5 85 122 72c17.5-13 40.5-11 53 2 12.5 13 12.5 29 0 42.5" stroke="#065f46" strokeWidth="3" strokeLinecap="round"/>
            <path d="M91.5 124C80 118 66.5 116.5 55.5 118" stroke="#065f46" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="140" cy="74.5" r="5" fill="#065f46" fillOpacity=".5"/>
            <path d="M153 74.5c-1.333 4-4 9.5-11.5 9.5s-16-5.5-16-11 7-10 14.5-10 14.333 4.333 13 7z" fill="#065f46" fillOpacity=".2"/>
            <path d="M125.5 107.5c11-6 21.8 -2.6 25.5 6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 2"/>
            <rect x="130" y="50" width="8" height="8" rx="2" fill="#3b82f6" opacity="0.6"/>
            <rect x="155" y="42" width="10" height="10" rx="2" fill="#f97316" opacity="0.6"/>
        </svg>
        <h3 className="text-xl font-bold text-brand-primary-dark mt-4">Secure & Insightful Analysis</h3>
        <p className="text-sm text-brand-textSecondary mt-1 max-w-xs">
            Create an account to save your analysis history and track animal performance over time, all in one secure place.
        </p>
    </div>
);