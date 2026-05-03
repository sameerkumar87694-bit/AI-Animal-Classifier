import React, { useEffect, useState } from 'react';
import type { AnalysisReport, Trait } from '../types';

// Define jsPDF types on the window object for CDN usage
declare global {
  interface Window {
    jspdf: any;
  }
}

interface AnalysisResultProps {
  result: AnalysisReport;
}

// Simulate the API call to BPA
const uploadToBPA = (report: AnalysisReport): Promise<{ success: true }> => {
  console.log("Uploading to BPA:", report);
  return new Promise((resolve, reject) => {
    // Simulate a network delay
    setTimeout(() => {
      // To test the error state, you can uncomment the next line
      // if (Math.random() > 0.5) return reject(new Error("BPA server is unavailable."));
      
      // Simulate a successful upload
      resolve({ success: true });
    }, 2000); // 2-second delay
  });
};


const getTraitIcon = (traitName: string) => {
    const name = traitName.toLowerCase();
    if (name.includes('length')) return <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />;
    if (name.includes('height')) return <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />;
    if (name.includes('width') || name.includes('chest')) return <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25" />;
    if (name.includes('angle') || name.includes('rump')) return <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />;
    return <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.096c.365.174.71.383 1.036.632a9.753 9.753 0 014.282 8.273c0 5.395-4.365 9.75-9.75 9.75S3 17.395 3 12c0-2.822 1.2-5.358 3.125-7.154" />;
};

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const [displayScore, setDisplayScore] = useState(0);
    const size = 120;
    const strokeWidth = 10;
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayScore / 100) * circumference;

    useEffect(() => {
        let currentScore = 0;
        const interval = setInterval(() => {
            currentScore += 1;
            if (currentScore > score) {
                clearInterval(interval);
                setDisplayScore(score);
            } else {
                setDisplayScore(currentScore);
            }
        }, 15);
        return () => clearInterval(interval);
    }, [score]);


    const color = score > 80 ? 'text-green-500' : score > 60 ? 'text-yellow-500' : 'text-red-500';
    const trackColor = score > 80 ? 'text-green-100' : score > 60 ? 'text-yellow-100' : 'text-red-100';

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
          <circle
            className={trackColor}
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={center}
            cy={center}
          />
          <circle
            className={color}
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={center}
            cy={center}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
            style={{ transition: 'stroke-dashoffset 0.3s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-black text-4xl ${color}`}>{displayScore}</span>
            <span className={`text-xs font-bold ${color}`}>/ 100</span>
        </div>
      </div>
    );
};


const TraitRow: React.FC<{ trait: Trait }> = ({ trait }) => {
  const [width, setWidth] = useState('0%');

  useEffect(() => {
    // Animate the bar width on mount
    const timer = setTimeout(() => setWidth(`${trait.score * 10}%`), 100);
    return () => clearTimeout(timer);
  }, [trait.score]);

  let scoreInfo: { color: string; textColor: string; text: string; badgeColor: string };
  if (trait.score >= 8) {
    scoreInfo = { color: 'bg-green-500', textColor: 'text-green-800', text: 'Excellent', badgeColor: 'bg-green-100' };
  } else if (trait.score >= 5) {
    scoreInfo = { color: 'bg-yellow-500', textColor: 'text-yellow-800', text: 'Good', badgeColor: 'bg-yellow-100' };
  } else {
    scoreInfo = { color: 'bg-red-500', textColor: 'text-red-800', text: 'Needs Improvement', badgeColor: 'bg-red-100' };
  }

  return (
    <div className="py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex justify-between items-center mb-2">
        <div className="relative group flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {getTraitIcon(trait.name)}
          </svg>
          <h4 className="font-bold text-brand-textPrimary cursor-help">{trait.name}</h4>
          
          <div className="absolute bottom-full left-8 mb-2 w-72 p-3 bg-brand-textPrimary text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-10 pointer-events-none">
            {trait.description}
            <svg className="absolute text-brand-textPrimary h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
              <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
            </svg>
          </div>
        </div>
        <div className="flex items-center space-x-3">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${scoreInfo.badgeColor} ${scoreInfo.textColor}`}>{scoreInfo.text}</span>
            <span className="font-bold text-brand-primary text-lg w-12 text-right">{trait.score}/10</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
        <div className={`${scoreInfo.color} h-2.5 rounded-full transition-all duration-1000 ease-out`} style={{ width: width }}></div>
      </div>
    </div>
  )
};

const SummaryCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="bg-gray-50/80 p-3 rounded-lg flex items-start gap-3 transition-all hover:bg-white hover:shadow-md">
        <div className="flex-shrink-0 text-brand-primary bg-green-100 p-2 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-semibold text-brand-textSecondary">{label}</p>
            <p className="font-bold text-brand-textPrimary text-base">{value}</p>
        </div>
    </div>
);

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  const [bpaUploadState, setBpaUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [bpaError, setBpaError] = useState<string | null>(null);

  const handleUploadToBPA = async () => {
    setBpaUploadState('uploading');
    setBpaError(null);
    try {
      await uploadToBPA(result);
      setBpaUploadState('success');
    } catch (error) {
      setBpaUploadState('error');
      setBpaError(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  const handleExportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Animal Classification Report', 105, 20, { align: 'center' });
    
    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });


    // Main Info
    doc.setFontSize(12);
    doc.text(`Predicted Breed:`, 20, 45);
    doc.setFont('helvetica', 'bold');
    doc.text(result.breed, 55, 45);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Overall Score:`, 20, 53);
    doc.setFont('helvetica', 'bold');
    doc.text(`${result.overall_score} / 100`, 55, 53);


    // Predictions
    doc.setFont('helvetica', 'bold');
    doc.text('Key Predictions', 20, 68);
    doc.setFont('helvetica', 'normal');
    doc.text(`- Longevity: ${result.longevity_prediction}`, 25, 76);
    doc.text(`- Productivity: ${result.productivity_prediction}`, 25, 84);
    doc.text(`- Reproductive Efficiency: ${result.reproductive_efficiency}`, 25, 92);

    // Trait Analysis Table
    const tableColumn = ["Trait", "Score (/10)", "Evaluation"];
    const tableRows = result.traits.map(trait => [trait.name, trait.score, trait.description]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 102,
      theme: 'striped',
      headStyles: { fillColor: [6, 95, 70] }, // brand-primary-dark
    });

    // Recommendations
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFont('helvetica', 'bold');
    doc.text('Recommendations', 20, finalY + 15);
    doc.setFont('helvetica', 'normal');
    const recommendationsText = doc.splitTextToSize(result.recommendations, 170);
    doc.text(recommendationsText, 20, finalY + 23);

    doc.save(`report-${result.breed.toLowerCase().replace(/\s/g, '_')}-${Date.now()}.pdf`);
  };
  
  const getBpaButtonContent = () => {
    switch(bpaUploadState) {
      case 'uploading':
        return (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Uploading...</span>
          </>
        );
      case 'success':
        return (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Uploaded to BPA</span>
          </>
        );
      case 'error':
        return <span>Retry Upload</span>;
      default:
        return (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H5.5z" />
              <path d="M9 13.5a1.5 1.5 0 011.5-1.5l3-1.5a1.5 1.5 0 010 2.732l-3 1.5A1.5 1.5 0 019 13.5z" />
            </svg>
            <span>Upload to BPA</span>
          </>
        );
    }
  };

  const getBpaButtonClasses = () => {
    let baseClasses = "inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold text-sm rounded-lg shadow-md focus:outline-none focus:ring-4 transform active:animate-button-press transition-all duration-300";
    switch(bpaUploadState) {
      case 'uploading':
        return `${baseClasses} bg-brand-accent text-white cursor-not-allowed`;
      case 'success':
        return `${baseClasses} bg-brand-primary text-white cursor-not-allowed`;
      case 'error':
        return `${baseClasses} bg-red-500 text-white hover:bg-red-600 focus:ring-red-300 transform hover:scale-105`;
      default:
        return `${baseClasses} bg-brand-accent text-white hover:bg-blue-600 focus:ring-blue-300 transform hover:scale-105`;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-stretch sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-primary-dark">Classification Report</h2>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleUploadToBPA}
            disabled={bpaUploadState === 'uploading' || bpaUploadState === 'success'}
            className={`${getBpaButtonClasses()} w-full sm:w-auto`}
          >
            {getBpaButtonContent()}
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white font-semibold text-sm rounded-lg shadow-md hover:bg-brand-primary-dark focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:scale-105 active:animate-button-press transition-all duration-300 w-full sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>Export PDF</span>
          </button>
        </div>
      </div>
      {bpaError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center text-sm">
          <strong>Upload Failed:</strong> {bpaError}
        </div>
      )}
      
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800">Analysis Summary</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 flex justify-center transform scale-90 sm:scale-100 origin-center">
                <ScoreCircle score={result.overall_score} />
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SummaryCard 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536A9.004 9.004 0 106.536 8.121" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12a3 3 0 100-6 3 3 0 000 6z" /></svg>}
                  label="Predicted Breed"
                  value={result.breed}
                />
                 <SummaryCard 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                  label="Productivity"
                  value={result.productivity_prediction}
                />
                <SummaryCard 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.364 12c-2.454 5.04-7.14 8-12.364 8-5.224 0-9.91-2.96-12.364-8C-2.09 6.96 2.596 4 7.82 4c5.224 0 9.91 2.96 12.364 8zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                  label="Longevity"
                  value={result.longevity_prediction}
                />
                <SummaryCard 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                  label="Reproduction"
                  value={result.reproductive_efficiency}
                />
            </div>
          </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800">Trait Analysis</h3>
          </div>
          <div>
            {result.traits.map((trait, index) => (
              <TraitRow key={index} trait={trait} />
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
           <div className="bg-green-50/80 p-6 rounded-xl shadow-inner-lg border border-green-200/50">
            <div className="flex items-center gap-3 mb-4 text-brand-primary-dark">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-xl font-bold">Recommendations</h3>
            </div>
            <p className="text-brand-textSecondary leading-relaxed">{result.recommendations}</p>
          </div>
        </div>
      </div>
    </div>
  );
};