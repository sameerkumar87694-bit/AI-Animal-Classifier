import React, { useState } from 'react';
import { loginUser } from '../services/authService';
import type { User } from '../types';
import { AuthIllustration } from './AuthIllustration';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onSwitchToRegister: () => void;
  onSwitchToVerify: (email: string) => void;
  onForgotPassword: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess, onSwitchToRegister, onSwitchToVerify, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) {
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await loginUser(email, password);
      onLoginSuccess(user);
    } catch (err) {
       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
       if (errorMessage.includes('Account not verified')) {
        setError(
            <>
                Account not verified.{" "}
                <button type="button" onClick={() => onSwitchToVerify(email)} className="font-bold text-brand-accent hover:underline">
                    Verify Now
                </button>
            </>
        );
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
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
                <h2 className="text-xl font-bold text-brand-primary-dark">Login</h2>
                <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <div className="p-3 bg-red-100 text-red-700 text-sm font-semibold rounded-lg">{error}</div>}
            <div>
                <label htmlFor="email" className="block text-sm font-bold text-brand-textPrimary mb-1">Email Address</label>
                <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"
                placeholder="you@example.com"
                />
            </div>
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password"  className="block text-sm font-bold text-brand-textPrimary">Password</label>
                    <button type="button" onClick={onForgotPassword} className="text-xs font-bold text-brand-accent hover:underline">Forgot Password?</button>
                </div>
                <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"
                placeholder="••••••••"
                />
            </div>
            <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand-accent text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105 active:animate-button-press transition-all duration-300 disabled:bg-gray-400 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <p className="text-sm text-center text-brand-textSecondary">
                    Don't have an account?{' '}
                    <button type="button" onClick={onSwitchToRegister} className="font-bold text-brand-accent hover:underline">Register here</button>
                </p>
            </form>
        </div>
      </div>
    </div>
  );
};
