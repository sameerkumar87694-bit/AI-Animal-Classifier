import React, { useState } from 'react';
import { KnowledgeBaseModal } from './KnowledgeBaseModal';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';
import { VerificationModal } from './VerificationModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { resendVerificationCode } from '../services/authService';
import type { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onLoginSuccess: (user: User) => void;
}

const GovLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-12 w-12 sm:h-14 sm:w-14 mr-2 sm:mr-3 text-brand-primary" fill="currentColor">
        <path d="M22,11.5a1,1,0,0,0-1-1,5.34,5.34,0,0,1-4.75-3.31,1,1,0,0,0-1.87.7,7.36,7.36,0,0,0,5.72,4A1,1,0,0,0,22,11.5Z"/>
        <path d="M15.11,2.5A1,1,0,0,0,14,3.13a7.36,7.36,0,0,0-4,5.72,1,1,0,0,0,.7,1.87,1,1,0,0,0,1.17-.7,5.34,5.34,0,0,1,3.31-4.75A1,1,0,0,0,15.11,2.5Z"/>
        <path d="M11.5,2a1,1,0,0,0-1,.89,5.34,5.34,0,0,1-3.31,4.75,1,1,0,1,0,.7,1.87A7.36,7.36,0,0,0,12,3.8,1,1,0,0,0,11.5,2Z"/>
        <path d="M3.13,10A1,1,0,0,0,2,11.12a7.36,7.36,0,0,0,5.72,4,1,1,0,1,0,.7-1.87A5.34,5.34,0,0,1,3.8,8.5,1,1,0,0,0,3.13,10Z"/>
        <path d="M12,13a4,4,0,1,0,4,4A4,4,0,0,0,12,13Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,19Z"/>
        <path d="M19,15a1,1,0,0,0-1.23.48,4,4,0,0,1-6.49,4.3,4.06,4.06,0,0,1-.52-1,1,1,0,1,0-1.93-.5,6,6,0,0,0,10,2.15A1,1,0,0,0,19,15Z"/>
    </svg>
);

export const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onLoginSuccess }) => {
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const [emailForVerification, setEmailForVerification] = useState('');
  const [verificationCodeForDemo, setVerificationCodeForDemo] = useState('');

  const closeAllAuthModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    setIsVerificationModalOpen(false);
    setIsForgotPasswordModalOpen(false);
  };

  const handleOpenRegister = () => {
    closeAllAuthModals();
    setIsRegisterModalOpen(true);
  }

  const handleOpenLogin = () => {
    closeAllAuthModals();
    setIsLoginModalOpen(true);
  }
  
  const handleOpenForgotPassword = () => {
    closeAllAuthModals();
    setIsForgotPasswordModalOpen(true);
  };
  
  const handleRegistrationComplete = ({ email, verificationCode }: { email: string; verificationCode: string }) => {
    closeAllAuthModals();
    setEmailForVerification(email);
    setVerificationCodeForDemo(verificationCode);
    setIsVerificationModalOpen(true);
  };
  
  const handleSwitchToVerify = async (email: string) => {
    if (!email) return;
    try {
        const newCode = await resendVerificationCode(email);
        closeAllAuthModals();
        setEmailForVerification(email);
        setVerificationCodeForDemo(newCode);
        setIsVerificationModalOpen(true);
    } catch (error) {
        console.error("Failed to switch to verification", error);
        // In a real app, you might show a toast notification with the error.
    }
  };


  return (
    <>
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <GovLogo />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-brand-primary-dark tracking-tight">
                Ministry of Fisheries, Animal Husbandry & Dairying
              </h1>
              <p className="text-xs sm:text-sm text-brand-textSecondary">
                Government of India
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end flex-wrap gap-2">
            <button
              onClick={() => setIsKnowledgeModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-brand-primary-dark font-semibold text-sm rounded-lg shadow-sm border border-gray-200 hover:bg-green-50 focus:outline-none focus:ring-4 focus:ring-green-200 transform hover:scale-105 active:animate-button-press transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V5.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.553l-3-1.5v9.894l3 1.5V6.553z" />
                <path d="M4 17a1 1 0 01-1.447-.894l-2-4A1 1 0 011 11V5.236a1 1 0 011.447-.894l2 4a1 1 0 01-.553.894V17zM4.789 6.553l-1.5-3v9.894l1.5 3V6.553z" />
                <path d="M9 4a1 1 0 00-1-1h-1a1 1 0 00-1 1v12a1 1 0 001 1h1a1 1 0 001-1V4z" />
              </svg>
              <span>Knowledge Base</span>
            </button>
            
            {currentUser ? (
              <>
                <span className="text-sm text-brand-textSecondary hidden sm:block">|</span>
                <span className="font-semibold text-brand-textPrimary text-sm hidden sm:block">Welcome, {currentUser.email}</span>
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-500 text-white font-semibold text-sm rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-200 transform hover:scale-105 active:animate-button-press transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                 <button 
                  onClick={handleOpenLogin}
                  className="px-4 py-2 bg-white text-brand-accent font-semibold text-sm rounded-lg shadow-sm border border-gray-200 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-200 transform hover:scale-105 active:animate-button-press transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={handleOpenRegister}
                  className="px-4 py-2 bg-brand-accent text-white font-semibold text-sm rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200 transform hover:scale-105 active:animate-button-press transition-colors"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <KnowledgeBaseModal isOpen={isKnowledgeModalOpen} onClose={() => setIsKnowledgeModalOpen(false)} />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeAllAuthModals} 
        onLoginSuccess={(user) => {
          onLoginSuccess(user);
          closeAllAuthModals();
        }}
        onSwitchToRegister={handleOpenRegister}
        onSwitchToVerify={handleSwitchToVerify}
        onForgotPassword={handleOpenForgotPassword}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={closeAllAuthModals}
        onRegistrationComplete={handleRegistrationComplete}
        onSwitchToLogin={handleOpenLogin}
      />
       <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={closeAllAuthModals}
        email={emailForVerification}
        demoCode={verificationCodeForDemo}
        onVerifySuccess={(user) => {
            onLoginSuccess(user);
            closeAllAuthModals();
        }}
        onResendCode={async (email) => {
            const newCode = await resendVerificationCode(email);
            setVerificationCodeForDemo(newCode);
        }}
      />
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={closeAllAuthModals}
        onSwitchToLogin={handleOpenLogin}
      />
    </>
  );
};