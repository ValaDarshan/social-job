import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { handleApiResponse } from '../services/apiService';
import { API_ENDPOINTS } from '../config/api';

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const result = await handleApiResponse(response, 'Failed to send reset email');

      setMessage(result.message || 'Check your inbox for further instructions');
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

        <div className="bg-white dark:bg-[#1E293B] py-10 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-200 dark:border-slate-700/50">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Forgot Password?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No worries! Enter your username associated with your SocialJob account and we'll send a reset link to your registered email.
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
              {message}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-colors disabled:opacity-70"
              >
                {isLoading ? 'Sending...' : 'Send Recovery Link'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
