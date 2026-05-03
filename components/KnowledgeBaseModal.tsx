import React, { useState } from 'react';

const TABS = ['About ATC', 'Common Breeds', 'Key Traits'];

const BreedIcon: React.FC<{ type: 'cattle' | 'buffalo' }> = ({ type }) => (
    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
        <svg className="w-7 h-7 text-brand-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {type === 'cattle' ? (
                <>
                    <path d="M85 40C85 30 75 30 70 25C65 20 60 10 50 10C40 10 35 20 30 25C25 30 15 30 15 40C15 55 25 60 30 70L25 90H75L70 70C75 60 85 55 85 40Z" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M45 45C45 45 40 50 50 50C60 50 55 45 55 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                </>
            ) : (
                <>
                    <path d="M25 40C25 40 30 50 40 50C50 50 65 30 75 35" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M75 60C75 60 70 50 60 50C50 50 35 70 25 65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M60 50C60 50 65 65 50 85C35 65 40 50 40 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="35" cy="40" r="5" fill="currentColor"/>
                    <circle cx="65" cy="40" r="5" fill="currentColor"/>
                </>
            )}
        </svg>
    </div>
);

const AboutContent = () => (
    <div className="space-y-4 text-brand-textSecondary leading-relaxed">
        <p><strong>Animal Type Classification (ATC)</strong> is a scientific method used in dairy farming to evaluate an animal's physical structure. This evaluation helps predict its longevity, productivity, and reproductive efficiency.</p>
        <p>Traditionally performed by trained personnel, this process can be subjective. By using AI to analyze images, we can achieve:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Standardization:</strong> Every animal is judged by the same criteria, removing human bias.</li>
            <li><strong>Reliability:</strong> Consistent and repeatable data for better scientific analysis and breeding decisions.</li>
            <li><strong>Efficiency:</strong> Faster and more accessible evaluation, especially in remote areas.</li>
        </ul>
        <p>This AI-driven approach is a key part of the <strong>Rashtriya Gokul Mission (RGM)</strong>, aiming to improve indigenous bovine breeds and enhance milk productivity across India.</p>
    </div>
);

const BreedsContent = () => (
    <div className="space-y-5">
        <div className="flex items-start">
            <BreedIcon type="cattle" />
            <div>
                <h4 className="font-bold text-brand-textPrimary">Gir (Cattle)</h4>
                <p className="text-sm text-brand-textSecondary">Known for their high milk production and heat tolerance. They have a distinctive domed forehead and long, pendulous ears.</p>
            </div>
        </div>
        <div className="flex items-start">
            <BreedIcon type="cattle" />
            <div>
                <h4 className="font-bold text-brand-textPrimary">Sahiwal (Cattle)</h4>
                <p className="text-sm text-brand-textSecondary">Another high-yielding breed, prized for its ability to thrive in hotter climates. They are typically reddish-brown in color.</p>
            </div>
        </div>
        <div className="flex items-start">
            <BreedIcon type="buffalo" />
            <div>
                <h4 className="font-bold text-brand-textPrimary">Murrah (Buffalo)</h4>
                <p className="text-sm text-brand-textSecondary">One of the world's premier dairy buffalo breeds. They are known for their deep black color, tightly curled horns, and high-fat milk.</p>
            </div>
        </div>
        <div className="flex items-start">
            <BreedIcon type="buffalo" />
            <div>
                <h4 className="font-bold text-brand-textPrimary">Nili-Ravi (Buffalo)</h4>
                <p className="text-sm text-brand-textSecondary">Distinguished by their white markings on the face and legs ("panch kalyani"). They are excellent milk producers.</p>
            </div>
        </div>
    </div>
);

const TraitsContent = () => (
    <div className="space-y-4 text-brand-textSecondary">
        <div>
            <h4 className="font-bold text-brand-textPrimary">Body Length & Height at Withers</h4>
            <p className="text-sm">These measurements are indicators of the animal's overall size and frame, which can correlate with its capacity for feed intake and milk production.</p>
        </div>
        <div>
            <h4 className="font-bold text-brand-textPrimary">Chest Width</h4>
            <p className="text-sm">A wider chest often indicates greater heart and lung capacity, contributing to better stamina and overall health.</p>
        </div>
        <div>
            <h4 className="font-bold text-brand-textPrimary">Rump Angle & Width</h4>
            <p className="text-sm">The structure of the rump is critical for reproductive efficiency. A proper angle and width can facilitate easier calving and reduce complications.</p>
        </div>
        <div>
            <h4 className="font-bold text-brand-textPrimary">Udder and Teat Structure</h4>
            <p className="text-sm">A well-attached udder and properly placed teats are crucial for longevity, ease of milking, and resistance to infections like mastitis.</p>
        </div>
    </div>
);


export const KnowledgeBaseModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in-up"
        style={{ animationDuration: '0.3s' }}
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V5.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.553l-3-1.5v9.894l3 1.5V6.553z" />
              <path d="M4 17a1 1 0 01-1.447-.894l-2-4A1 1 0 011 11V5.236a1 1 0 011.447-.894l2 4a1 1 0 01-.553.894V17zM4.789 6.553l-1.5-3v9.894l1.5 3V6.553z" />
              <path d="M9 4a1 1 0 00-1-1h-1a1 1 0 00-1 1v12a1 1 0 001 1h1a1 1 0 001-1V4z" />
            </svg>
            <h2 className="text-xl font-bold text-brand-primary-dark">Knowledge Base</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-2">
                {TABS.map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 w-full ${activeTab === tab ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-textSecondary hover:bg-gray-100'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        <div className="p-6 overflow-y-auto">
            {activeTab === 'About ATC' && <AboutContent />}
            {activeTab === 'Common Breeds' && <BreedsContent />}
            {activeTab === 'Key Traits' && <TraitsContent />}
        </div>
      </div>
    </div>
  );
};
