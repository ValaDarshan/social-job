import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { handleApiResponse } from '../services/apiService';

export default function VerifyEmail() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid or missing verification token.');
        return;
      }

      try {
        const response = await fetch('http://localhost:9012/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const result = await handleApiResponse(response, 'Email verification failed.');

        setStatus('success');
        setMessage(result.message || 'Your email has been verified successfully!');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Email verification failed. The link may be expired or invalid.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <span className="font-bold text-xl tracking-tight">ProStream</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] py-10 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-200 dark:border-slate-700/50">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-500 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verifying your email...</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Please wait while we verify your email address.
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Email Verified!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                {message}
              </p>
              <Link
                to="/login"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-colors"
              >
                Continue to Login
              </Link>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verification Failed</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                {message}
              </p>
              <Link
                to="/login"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-colors"
              >
                Go to Login
              </Link>
            </div>
          )}

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
