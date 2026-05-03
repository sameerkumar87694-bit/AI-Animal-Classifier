import React, { useState, useEffect } from 'react';
import { verifyUser } from '../services/authService';
import type { User } from '../types';
import { AuthIllustration } from './AuthIllustration';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifySuccess: (user: User) => void;
  email: string;
  demoCode: string;
  onResendCode: (email: string) => Promise<void>;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, onVerifySuccess, email, demoCode, onResendCode }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [currentDemoCode, setCurrentDemoCode] = useState(demoCode);
  
  useEffect(() => {
    // Update the displayed code if a new one is resent
    setCurrentDemoCode(demoCode);
  }, [demoCode]);

  // Reset form state when modal opens for a new user
  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError(null);
      setIsLoading(false);
      setResendStatus('idle');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await verifyUser(email, code);
      onVerifySuccess(user);
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendClick = async () => {
    setError(null);
    setResendStatus('sending');
    try {
        await onResendCode(email);
        setResendStatus('sent');
        setTimeout(() => setResendStatus('idle'), 3000);
    } catch (e) {
        setError('Failed to resend code.');
        setResendStatus('idle');
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in-up"
        style={{ animationDuration: '0.3s' }}
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="hidden md:block md:w-1/2 bg-green-50 p-8">
            <AuthIllustration />
        </div>
        <div className="w-full md:w-1/2">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-brand-primary-dark">Verify Your Account</h2>
                <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="p-6">
                <p className="text-center text-brand-textSecondary text-sm mb-4">
                    A verification code has been sent to <strong>{email}</strong>. Please enter it below to activate your account.
                </p>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center mb-4">
                    <p className="text-xs text-yellow-700">For this demo, your verification code is:</p>
                    <p className="font-mono font-bold text-lg text-yellow-800 tracking-widest">{currentDemoCode}</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="p-3 bg-red-100 text-red-700 text-sm font-semibold rounded-lg">{error}</div>}
                <div>
                    <label htmlFor="verification-code" className="block text-sm font-bold text-brand-textPrimary mb-1">Verification Code</label>
                    <input 
                        type="text" 
                        id="verification-code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        maxLength={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition text-center text-lg tracking-[0.3em]"
                        placeholder="_ _ _ _ _ _"
                    />
                </div>
                
                <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand-accent text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105 active:animate-button-press transition-all duration-300 disabled:bg-gray-400 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Verifying...' : 'Verify & Login'}
                    </button>
                    <div className="text-sm text-center text-brand-textSecondary">
                        Didn't receive the code?{' '}
                        <button type="button" onClick={handleResendClick} disabled={resendStatus !== 'idle'} className="font-bold text-brand-accent hover:underline disabled:text-gray-400 disabled:no-underline">
                            {resendStatus === 'idle' && 'Resend Code'}
                            {resendStatus === 'sending' && 'Sending...'}
                            {resendStatus === 'sent' && 'Sent!'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};
