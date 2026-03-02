import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { handleApiResponse } from '../services/apiService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { error: configError, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:9012/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = await handleApiResponse(response, 'Failed to log in');

      if (result.data?.accessToken && result.data?.refreshToken) {
        login(result.data.accessToken, result.data.refreshToken, { username });
        navigate('/');
      } else {
        throw new Error(result.message || 'Invalid response from server');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-200 transition-colors duration-200">
      {/* Left Side - Image & Copy */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-100 dark:bg-slate-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
          alt="Office"
          className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 dark:from-slate-900/90 dark:via-slate-900/40 to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 h-full w-full">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <span className="font-bold text-xl tracking-tight">ProStream</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Connect with professionals through a visual-first lens.
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg mb-12">
              Join the community where creativity meets career growth. Showcase your portfolio and network seamlessly.
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900" />
                <img src="https://i.pravatar.cc/100?img=2" alt="User" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900" />
                <img src="https://i.pravatar.cc/100?img=3" alt="User" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900" />
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-300">Join 10k+ professionals today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400">Please enter your details to sign into your account.</p>
          </div>

          {configError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {configError}
            </div>
          )}
          
          {localError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {localError}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-[#0F172A] text-slate-500 text-xs uppercase tracking-wider">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-slate-800/50 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400">
              Create an Account
            </Link>
          </p>

          <div className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500">
            <p>© 2024 ProStream Inc. All rights reserved.</p>
            <div className="mt-1 space-x-2">
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-400">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-400">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
