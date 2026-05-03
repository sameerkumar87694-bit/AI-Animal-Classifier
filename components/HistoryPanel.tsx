import React from 'react';
import { AnalysisReportWithMeta, User } from '../types';

interface HistoryPanelProps {
  history: AnalysisReportWithMeta[];
  onSelect: (id: number) => void;
  onClear: () => void;
  selectedId: number | null;
  currentUser: User | null;
}

const HistoryItem: React.FC<{ item: AnalysisReportWithMeta; onSelect: (id: number) => void; isSelected: boolean; }> = ({ item, onSelect, isSelected }) => {
  let scoreStyles: { bg: string; text: string; border: string; };
  if (item.overall_score > 80) {
    scoreStyles = { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
  } else if (item.overall_score > 60) {
    scoreStyles = { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
  } else {
    scoreStyles = { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
  }

  return (
    <li 
      className={`flex items-center p-2 sm:p-2.5 rounded-xl cursor-pointer transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg ${isSelected ? 'bg-green-100 ring-2 ring-brand-primary' : 'bg-white hover:bg-gray-50'}`}
      onClick={() => onSelect(item.id)}
      aria-current={isSelected ? 'true' : 'false'}
    >
      <img src={item.imageDataUrl} alt={`Analyzed ${item.breed}`} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg shadow-sm mr-3 sm:mr-4 flex-shrink-0" />
      <div className="flex-grow min-w-0">
        <p className="font-bold text-brand-textPrimary truncate">{item.breed}</p>
        <p className="text-sm text-brand-textSecondary">{new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
      </div>
      <div className={`flex-shrink-0 ml-2 sm:ml-3 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center border-2 ${scoreStyles.bg} ${scoreStyles.border}`}>
        <span className={`font-black text-xl sm:text-2xl ${scoreStyles.text}`}>{item.overall_score}</span>
        <span className={`text-xs font-semibold -mt-1 ${scoreStyles.text}`}>Score</span>
      </div>
    </li>
  );
};

const NoHistoryIllustration = () => (
    <svg className="mx-auto h-20 w-20 text-gray-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 35v50h40L75 75V25H35l-10 10z" fill="#F3F4F6"/>
        <path d="M75 75L65 85h-40V35l10-10h30l10 10v40z" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M35 25L25 35" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M65 75V85L75 75" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="50" cy="55" r="12" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50 48v7h5" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const LoginPromptIllustration = () => (
    <svg className="mx-auto h-20 w-20 text-gray-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85z" fill="#F3F4F6"/>
        <path d="M50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85z" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50 60C58.2843 60 65 53.2843 65 45C65 36.7157 58.2843 30 50 30C41.7157 30 35 36.7157 35 45C35 53.2843 41.7157 60 50 60z" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M30 75C30 66.7157 38.9543 60 50 60C61.0457 60 70 66.7157 70 75" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear, selectedId, currentUser }) => {
  return (
    <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-200/80 sticky top-28">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-brand-primary-dark">Recent Analyses</h2>
        </div>
        {currentUser && history.length > 0 && (
            <button onClick={onClear} className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors duration-200 transform hover:scale-110">
                Clear All
            </button>
        )}
      </div>
      
      {!currentUser ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
           <LoginPromptIllustration />
          <p className="mt-3 font-semibold text-brand-textPrimary">
            Login to Save History
          </p>
          <p className="mt-1 text-sm text-brand-textSecondary px-4">
            Please log in or register to save and view your analysis history.
          </p>
        </div>
      ) : history.length > 0 ? (
        <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 -mr-2">
          {history.map(item => (
            <HistoryItem key={item.id} item={item} onSelect={onSelect} isSelected={selectedId === item.id} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
          <NoHistoryIllustration />
          <p className="mt-3 font-semibold text-brand-textPrimary">
            No history yet
          </p>
          <p className="mt-1 text-sm text-brand-textSecondary px-4">
            Your past analysis reports will appear here once you analyze an image.
          </p>
        </div>
      )}
    </div>
  );
};