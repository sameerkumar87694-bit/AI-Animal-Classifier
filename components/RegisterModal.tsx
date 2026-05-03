import React, { useState } from 'react';
import { registerUser } from '../services/authService';
import { AuthIllustration } from './AuthIllustration';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationComplete: (data: { email: string; verificationCode: string }) => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onRegistrationComplete, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; label: string; color: string } | null>(null);
  
  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (!password) {
      setPasswordStrength(null);
      return;
    }
    
    // Add points for various criteria
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label = '';
    let color = '';

    // If password is very short, override score
    if (password.length > 0 && password.length < 6) {
      score = 1;
      label = 'Too short';
      color = 'bg-red-500';
    } else {
        switch (score) {
          case 0:
          case 1:
            label = 'Weak';
            color = 'bg-red-500';
            break;
          case 2:
            label = 'Medium';
            color = 'bg-yellow-500';
            break;
          case 3:
            label = 'Good';
            color = 'bg-lime-500';
            break;
          case 4:
          case 5:
            label = 'Strong';
            color = 'bg-green-500';
            break;
          default:
            label = '';
            color = '';
        }
    }
    
    setPasswordStrength({ score, label, color });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    calculatePasswordStrength(newPassword);
  };


  if (!isOpen) {
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
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
      // Fix: Used a new variable for the registration result to avoid shadowing the 'email' state variable, which caused a "used before declaration" error.
      const registrationResult = await registerUser(email, password);
      onRegistrationComplete(registrationResult);
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unknown error occurred.');
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
              <h2 className="text-xl font-bold text-brand-primary-dark">Create Account</h2>
              <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <div className="p-3 bg-red-100 text-red-700 text-sm font-semibold rounded-lg">{error}</div>}
            <div>
              <label htmlFor="register-email" className="block text-sm font-bold text-brand-textPrimary mb-1">Email Address</label>
              <input 
                type="email" 
                id="register-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="register-password"  className="block text-sm font-bold text-brand-textPrimary mb-1">Password</label>
              <input 
                type="password" 
                id="register-password"
                value={password}
                onChange={handlePasswordChange}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"
                placeholder="Minimum 6 characters"
              />
            </div>
            {passwordStrength && (
              <div className="flex items-center gap-2 -mt-2">
                <div className="grid grid-cols-5 gap-1 w-full h-1.5">
                  <div className={`rounded-full transition-colors ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-gray-200'}`}></div>
                  <div className={`rounded-full transition-colors ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-gray-200'}`}></div>
                  <div className={`rounded-full transition-colors ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-gray-200'}`}></div>
                  <div className={`rounded-full transition-colors ${passwordStrength.score >= 4 ? passwordStrength.color : 'bg-gray-200'}`}></div>
                  <div className={`rounded-full transition-colors ${passwordStrength.score >= 5 ? passwordStrength.color : 'bg-gray-200'}`}></div>
                </div>
                <span className={`text-xs font-semibold w-24 text-right ${
                  {
                    'Weak': 'text-red-600',
                    'Too short': 'text-red-600',
                    'Medium': 'text-yellow-600',
                    'Good': 'text-lime-600',
                    'Strong': 'text-green-600'
                  }[passwordStrength.label] || 'text-gray-500'
                }`}>{passwordStrength.label}</span>
              </div>
            )}
            <div>
              <label htmlFor="confirm-password"  className="block text-sm font-bold text-brand-textPrimary mb-1">Confirm Password</label>
              <input 
                type="password" 
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition"
                placeholder="Re-enter your password"
              />
            </div>
            <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand-accent text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105 active:animate-button-press transition-all duration-300 disabled:bg-gray-400 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
              >
                  {isLoading ? 'Creating Account...' : 'Register'}
              </button>
              <p className="text-sm text-center text-brand-textSecondary">
                  Already have an account?{' '}
                  <button type="button" onClick={onSwitchToLogin} className="font-bold text-brand-accent hover:underline">Login here</button>
              </p>
          </form>
        </div>
      </div>
    </div>
  );
};