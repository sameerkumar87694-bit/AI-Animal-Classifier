import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { Loader } from './components/Loader';
import { analyzeAnimalImage } from './services/geminiService';
import type { AnalysisReport, AnalysisReportWithMeta, User } from './types';
import { Footer } from './components/Footer';
import { HistoryPanel } from './components/HistoryPanel';
import { getCurrentUser, logoutUser } from './services/authService';

const HeroIllustration = () => (
  <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet" className="absolute top-0 left-1/2 -translate-x-1/2 max-w-4xl w-full h-auto opacity-10 -z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M158.5 133.5C158.5 125.5 153.167 122.333 149.5 121C145.833 119.667 137 118 127.5 121C118 124 113.833 128.333 112.5 131L118 158.5H153.5L158.5 133.5Z" stroke="#059669" strokeWidth="2"/>
    <path d="M222 134C222 126 216.667 122.833 213 121.5C209.333 120.167 200.5 118.5 191 121.5C181.5 124.5 177.333 128.833 176 131.5L181.5 159H217L222 134Z" stroke="#059669" strokeWidth="2"/>
    <path d="M112.5 131C105.5 119 105.5 101.5 123 88.5C140.5 75.5 163.5 77.5 176 88.5C188.5 99.5 188.5 115.5 176 131.5" stroke="#059669" strokeWidth="2" strokeLinecap="round"/>
    <path d="M164 88.5C163.167 92.6667 161 99.5 154 99.5C147 99.5 142.5 93.5 142.5 88.5C142.5 83.5 148 79.5 154 79.5C160 79.5 165 84.3333 164 88.5Z" fill="#059669" opacity="0.5"/>
    <circle cx="154" cy="85.5" r="2" fill="#059669"/>
    <path d="M259.5 107.5C270.5 101.5 281.3 104.9 285 113.5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 2"/>
    <rect x="250" y="80" width="8" height="8" rx="2" fill="#3b82f6" opacity="0.6"/>
    <rect x="265" y="72" width="10" height="10" rx="2" fill="#f97316" opacity="0.6"/>
    <path d="M288 121C288 116.5 291 118 293 115C295 112 296.5 109.5 296.5 104C296.5 98.5 292 95 285 96.5" stroke="#059669" strokeWidth="2" strokeLinecap="round"/>
    <path d="M285.5 159L285 131.5C279.833 128.333 273.5 124.5 268.5 127C263.5 129.5 260.167 136.167 259 140L253 159H285.5Z" stroke="#059669" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M322 159L319.5 139.5C316.333 138.667 311.5 138.5 307.5 140.5C303.5 142.5 300.5 146.5 299.5 149.5L293.5 159H322Z" stroke="#059669" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M259 140C247.5 134 233 132.5 222 134" stroke="#059669" strokeWidth="2" strokeLinecap="round"/>
    <line x1="255" y1="170" x2="320" y2="170" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 3"/>
    <line x1="115" y1="170" x2="155" y2="170" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 3"/>
  </svg>
);


const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisReportWithMeta[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());

  // Load history from localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      try {
        const storedHistory = localStorage.getItem(`analysisHistory_${currentUser.email}`);
        if (storedHistory) {
          setAnalysisHistory(JSON.parse(storedHistory));
        } else {
          setAnalysisHistory([]);
        }
      } catch (e) {
        console.error("Failed to parse history from localStorage", e);
        setAnalysisHistory([]);
      }
    } else {
      setAnalysisHistory([]);
    }
  }, [currentUser]);

  // Save history to localStorage whenever it changes for the current user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`analysisHistory_${currentUser.email}`, JSON.stringify(analysisHistory));
    }
  }, [analysisHistory, currentUser]);
  
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    handleAnalyzeAnother(); // Clear the main view
  };


  const handleImageSelect = useCallback((file: File, dataUrl: string) => {
    setImageFile(file);
    setImageDataUrl(dataUrl);
    setAnalysisResult(null);
    setError(null);
    setSelectedHistoryId(null);
  }, []);

  const handleAnalyzeClick = async () => {
    if (!imageFile || !imageDataUrl) {
      setError('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setSelectedHistoryId(null);

    try {
      const base64String = imageDataUrl.split(',')[1];
      const mimeType = imageFile.type;

      const result = await analyzeAnimalImage(base64String, mimeType);
      
      if (currentUser) {
        const newHistoryItem: AnalysisReportWithMeta = {
          ...result,
          id: Date.now(),
          timestamp: new Date().toISOString(),
          imageDataUrl: imageDataUrl,
        };
        // Prepend new item and limit history size
        setAnalysisHistory(prevHistory => [newHistoryItem, ...prevHistory].slice(0, 10));
      }

      setAnalysisResult(result);

    } catch (err) {
      console.error(err);
      setError('Failed to analyze the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (id: number) => {
    const selectedItem = analysisHistory.find(item => item.id === id);
    if (selectedItem) {
      setAnalysisResult(selectedItem);
      setImageDataUrl(selectedItem.imageDataUrl);
      setImageFile(null); // Prevent re-analysis of the same file
      setSelectedHistoryId(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearHistory = () => {
    setAnalysisHistory([]);
  };

  const handleAnalyzeAnother = () => {
    setImageFile(null);
    setImageDataUrl(null);
    setAnalysisResult(null);
    setError(null);
    setSelectedHistoryId(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-textPrimary">
      <Header currentUser={currentUser} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess}/>
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10 relative">
          <HeroIllustration />
           <div className="inline-flex items-center justify-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 13l-4 4-4-4M12 3v14"/>
                <path d="M18 9l-2.085 2.085A5.43 5.43 0 0114 11.002V11c-1.333 0-2.667.2-4 .6-1.333.4-2.667.933-4 1.6.533-1.067.867-2.267 1-3.6 0-1.2.067-2.4-.2-3.6-.267-1.2-.8-2.267-1.6-3.2"/>
             </svg>
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-primary-dark">
              AI-Powered Animal Classification
            </h1>
          </div>
          <p className="mt-3 text-base sm:text-lg text-brand-textSecondary max-w-3xl mx-auto">
            Upload an image of cattle or a buffalo to automatically evaluate its physical traits and receive a standardized classification score.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <div className="bg-brand-surface/60 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-200/80">
              <ImageUploader onImageSelect={handleImageSelect} imageDataUrl={imageDataUrl} onClearImage={handleAnalyzeAnother} />

              <div className="mt-6 text-center">
                {analysisResult && !isLoading ? (
                   <button
                    onClick={handleAnalyzeAnother}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-lg shadow-green-500/20 hover:bg-brand-primary-dark focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:scale-105 active:animate-button-press transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    <span>Analyze Another Animal</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAnalyzeClick}
                    disabled={!imageFile || isLoading}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 w-52 bg-brand-accent text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105 active:animate-button-press transition-all duration-300 disabled:bg-gray-400 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 3.5a1.5 1.5 0 01.5 2.915V9.5a1.5 1.5 0 01-3 0V6.415A1.5 1.5 0 0110 3.5z" />
                          <path d="M4.5 9.5a1.5 1.5 0 013 0V12a1 1 0 01-2 0V9.5z" />
                          <path d="M12.5 9.5a1.5 1.5 0 013 0V12a1 1 0 01-2 0V9.5z" />
                          <path fillRule="evenodd" d="M5 14.5a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM15 14.5a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5z" clipRule="evenodd" />
                        </svg>
                        <span>Analyze Animal</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {isLoading && <Loader />}
              
              {error && (
                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center animate-fade-in-up">
                  <p>{error}</p>
                </div>
              )}
              
              {analysisResult && (
                <div className="mt-8">
                  <AnalysisResult result={analysisResult} />
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-1">
             <HistoryPanel 
                history={analysisHistory} 
                onSelect={handleSelectHistoryItem}
                onClear={handleClearHistory}
                selectedId={selectedHistoryId}
                currentUser={currentUser}
              />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;