import React, { useState } from 'react';
import { sendPasswordResetCode, resetPassword } from '../services/authService';
import { AuthIllustration } from './AuthIllustration';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code and new password, 3: Success
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [demoCode, setDemoCode] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; label: string; color: string } | null>(null);

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (!password) {
      setPasswordStrength(null);
      return;
    }
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label = '';
    let color = '';
    if (password.length > 0 && password.length < 6) {
      score = 1;
      label = 'Too short';
      color = 'bg-red-500';
    } else {
        switch (score) {
          case 0: case 1: label = 'Weak'; color = 'bg-red-500'; break;
          case 2: label = 'Medium'; color = 'bg-yellow-500'; break;
          case 3: label = 'Good'; color = 'bg-lime-500'; break;
          case 4: case 5: label = 'Strong'; color = 'bg-green-500'; break;
          default: label = ''; color = '';
        }
    }
    setPasswordStrength({ score, label, color });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pass = e.target.value;
    setNewPassword(pass);
    calculatePasswordStrength(pass);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const sentCode = await sendPasswordResetCode(email);
      setDemoCode(sentCode); // For demo purposes
      setIsLoading(false);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
     if ((passwordStrength?.score || 0) < 2) {
      setError("Password is too weak. Please choose a stronger password.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      setIsLoading(false);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    // Reset state on close
    setTimeout(() => {
        setStep(1);
        setEmail('');
        setCode('');
        setNewPassword('');
        setConfirmPassword('');
        setError(null);
        setDemoCode('');
        setPasswordStrength(null);
    }, 300); // Delay to allow animation
    onClose();
  };


  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in-up"
        style={{ animationDuration: '0.3s' }}
        onClick={handleClose}
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
                <h2 className="text-xl font-bold text-brand-primary-dark">Reset Password</h2>
                <button onClick={handleClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div className="p-6">
                {error && <div className="p-3 mb-4 bg-red-100 text-red-700 text-sm font-semibold rounded-lg">{error}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendCode} className="space-y-4">
                        <p className="text-sm text-brand-textSecondary">Enter your email address and we'll send you a code to reset your password.</p>
                        <div>
                            <label htmlFor="reset-email" className="block text-sm font-bold text-brand-textPrimary mb-1">Email Address</label>
                            <input type="email" id="reset-email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition" placeholder="you@example.com" />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full inline-flex items-center justify-center px-8 py-3 bg-brand-accent text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 active:animate-button-press transition-all disabled:bg-gray-400">
                            {isLoading ? 'Sending...' : 'Send Reset Code'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="space-y-3">
                        <p className="text-sm text-brand-textSecondary">A reset code was sent to <strong>{email}</strong>. Enter it below along with your new password.</p>
                        {demoCode !== "DEMO_CODE_NOT_SENT" && (
                            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                                <p className="text-xs text-yellow-700">For this demo, your reset code is:</p>
                                <p className="font-mono font-bold text-base text-yellow-800 tracking-widest">{demoCode}</p>
                            </div>
                        )}
                        <div>
                            <label htmlFor="reset-code" className="block text-sm font-bold text-brand-textPrimary mb-1">Reset Code</label>
                            <input type="text" id="reset-code" value={code} onChange={(e) => setCode(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"/>
                        </div>
                        <div>
                            <label htmlFor="new-password"  className="block text-sm font-bold text-brand-textPrimary mb-1">New Password</label>
                            <input type="password" id="new-password" value={newPassword} onChange={handlePasswordChange} required minLength={6} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"/>
                        </div>
                         {passwordStrength && (
                           <div className="flex items-center gap-2 -mt-2">
                                <div className="grid grid-cols-5 gap-1 w-full h-1.5"><div className={`rounded-full transition-colors ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-gray-200'}`}></div><div className={`rounded-full transition-colors ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-gray-200'}`}></div><div className={`rounded-full transition-colors ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-gray-200'}`}></div><div className={`rounded-full transition-colors ${passwordStrength.score >= 4 ? passwordStrength.color : 'bg-gray-200'}`}></div><div className={`rounded-full transition-colors ${passwordStrength.score >= 5 ? passwordStrength.color : 'bg-gray-200'}`}></div></div>
                                <span className={`text-xs font-semibold w-24 text-right ${{'Weak': 'text-red-600','Too short': 'text-red-600','Medium': 'text-yellow-600','Good': 'text-lime-600','Strong': 'text-green-600'}[passwordStrength.label] || 'text-gray-500'}`}>{passwordStrength.label}</span>
                            </div>
                        )}
                        <div>
                            <label htmlFor="confirm-new-password"  className="block text-sm font-bold text-brand-textPrimary mb-1">Confirm New Password</label>
                            <input type="password" id="confirm-new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"/>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full inline-flex items-center justify-center px-8 py-3 bg-brand-accent text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 active:animate-button-press transition-all disabled:bg-gray-400">
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <div className="text-center space-y-4 py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h3 className="text-xl font-bold text-brand-primary-dark">Password Reset Successfully!</h3>
                        <p className="text-brand-textSecondary">You can now log in with your new password.</p>
                        <button onClick={onSwitchToLogin} className="w-full inline-flex items-center justify-center px-8 py-3 bg-brand-accent text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 active:animate-button-press transition-all">
                            Back to Login
                        </button>
                    </div>
                )}
                 <p className="text-sm text-center text-brand-textSecondary mt-4">
                    Remember your password?{' '}
                    <button type="button" onClick={onSwitchToLogin} className="font-bold text-brand-accent hover:underline">Login here</button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
