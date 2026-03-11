import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EyeOff, Eye, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { handleApiResponse } from '../services/apiService';
import { API_ENDPOINTS } from '../config/api';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 8) {
      return setError('Password must be at least 8 characters long');
    }

    if (!token) {
      return setError('Invalid or missing password reset token');
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await handleApiResponse(response, 'Failed to reset password');

      setMessage(result.message || 'Password has been reset successfully.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          {/* Light mode: icon + text */}
          <div className="flex dark:hidden items-center gap-2">
            <div className="w-12 h-12 shrink-0">
              <img src="/light-mobile.png" alt="SocialJob" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SocialJob
            </span>
          </div>
          {/* Dark mode: icon + text */}
          <div className="hidden dark:flex items-center gap-2">
            <div className="w-12 h-12 shrink-0">
              <img src="/dark-mobile.png" alt="SocialJob" className="w-full h-full object-contain mix-blend-screen" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-pink-500 via-red-500 to-blue-500 bg-clip-text text-transparent">
              SocialJob
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] py-10 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-100 dark:border-slate-700/50">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Reset your password</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enter a new password for your account. Make sure it's strong and secure.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <div>
                <p>{message}</p>
                <p className="text-green-600 dark:text-green-500 text-xs mt-1">Redirecting to login page shortly...</p>
              </div>
            </div>
          )}

          {!token && !message && (
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Invalid or missing reset token. Please request a new password reset link.
              </p>
              <Link to="/forgot-password" className="text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 font-medium text-sm">
                Go to Forgot Password
              </Link>
            </div>
          )}

          {token && !message && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                    placeholder="Enter new password"
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye className="h-5 w-5 text-slate-400 dark:text-slate-500" /> : <EyeOff className="h-5 w-5 text-slate-400 dark:text-slate-500" />}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                    placeholder="Re-enter new password"
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <Eye className="h-5 w-5 text-slate-400 dark:text-slate-500" /> : <EyeOff className="h-5 w-5 text-slate-400 dark:text-slate-500" />}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Password strength</span>
                  <span className={password.length >= 8 ? "text-green-500 font-medium" : "text-orange-500 font-medium"}>
                    {password.length >= 8 ? "Good" : "Weak"}
                  </span>
                </div>
                <div className="flex gap-1 h-1.5">
                  <div className={`flex-1 rounded-full ${password.length > 0 ? (password.length >= 8 ? 'bg-green-500' : 'bg-orange-500') : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                  <div className={`flex-1 rounded-full ${password.length >= 4 ? (password.length >= 8 ? 'bg-green-500' : 'bg-orange-500') : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                  <div className={`flex-1 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                  <div className={`flex-1 rounded-full ${password.length >= 12 ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Must be at least 8 characters long.
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-colors disabled:opacity-70"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to log in
            </Link>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4 text-xs text-slate-400 dark:text-slate-500">
          <a href="#" className="hover:text-slate-600 dark:hover:text-slate-400">Privacy</a>
          <a href="#" className="hover:text-slate-600 dark:hover:text-slate-400">Terms</a>
          <a href="#" className="hover:text-slate-600 dark:hover:text-slate-400">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
