import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import TopNavbar from '../components/TopNavbar';
import { Moon, Sun, Monitor, Smartphone, Monitor as DesktopIcon, Globe, Trash2, Loader2, RefreshCw, Shield, AlertTriangle } from 'lucide-react';
import { apiService, handleApiResponse } from '../services/apiService';
import { API_ENDPOINTS } from '../config/api';

interface Session {
  sessionId: string;
  deviceName: string;
  ipAddress: string;
  createdAt: string;
  lastAccessedAt: string;
  currentSession: boolean;
}

interface SessionsData {
  totalActiveSessions: number;
  sessions: Session[];
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState('');
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokeSuccess, setRevokeSuccess] = useState('');

  const fetchSessions = async () => {
    setSessionsLoading(true);
    setSessionsError('');
    try {
      const response = await apiService.fetchWithAuth(API_ENDPOINTS.SESSIONS);
      const result = await handleApiResponse<SessionsData>(response, 'Failed to load sessions');
      if (result.data) {
        setSessions(result.data.sessions);
        setTotalSessions(result.data.totalActiveSessions);
      }
    } catch (err: any) {
      setSessionsError(err.message || 'Failed to load sessions');
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeSession = async (sessionId: string) => {
    setRevokingId(sessionId);
    setRevokeSuccess('');
    setSessionsError('');
    try {
      const response = await apiService.fetchWithAuth(API_ENDPOINTS.SESSIONS, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const result = await handleApiResponse(response, 'Failed to revoke session');
      setRevokeSuccess(result.message || 'Session revoked successfully');
      // Refresh the sessions list
      await fetchSessions();
    } catch (err: any) {
      setSessionsError(err.message || 'Failed to revoke session');
    } finally {
      setRevokingId(null);
    }
  };

  const getDeviceIcon = (deviceName: string) => {
    const lower = deviceName.toLowerCase();
    if (lower.includes('mobile') || lower.includes('android') || lower.includes('iphone')) {
      return <Smartphone className="w-5 h-5" />;
    }
    if (lower.includes('chrome') || lower.includes('firefox') || lower.includes('safari') || lower.includes('edge') || lower.includes('browser')) {
      return <Globe className="w-5 h-5" />;
    }
    return <DesktopIcon className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] transition-colors duration-200">
      <TopNavbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Settings</h1>
        
        {/* Appearance Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Sun className="w-5 h-5 text-blue-500" />
              Appearance
            </h2>
            
            <div className="space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Customize how SocialJob looks on your device.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    theme === 'light'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sun className="h-8 w-8 mb-3" />
                  <span className="font-medium">Light</span>
                </button>
                
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Moon className="h-8 w-8 mb-3" />
                  <span className="font-medium">Dark</span>
                </button>
                
                <button
                  onClick={() => setTheme('system')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    theme === 'system'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Monitor className="h-8 w-8 mb-3" />
                  <span className="font-medium">System</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Sessions Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Active Sessions
                </h2>
                {!sessionsLoading && !sessionsError && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {totalSessions} active {totalSessions === 1 ? 'session' : 'sessions'} on your account
                  </p>
                )}
              </div>
              <button
                onClick={fetchSessions}
                disabled={sessionsLoading}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                title="Refresh sessions"
              >
                <RefreshCw className={`w-5 h-5 ${sessionsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Success Message */}
            {revokeSuccess && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl text-green-600 dark:text-green-400 text-sm">
                {revokeSuccess}
              </div>
            )}

            {/* Error Message */}
            {sessionsError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {sessionsError}
              </div>
            )}

            {/* Loading State */}
            {sessionsLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mb-3" />
                <p className="text-sm">Loading sessions...</p>
              </div>
            )}

            {/* Sessions List */}
            {!sessionsLoading && !sessionsError && sessions.length > 0 && (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.sessionId}
                    className={`p-4 rounded-xl border transition-colors ${
                      session.currentSession
                        ? 'border-green-200 dark:border-green-500/30 bg-green-50/50 dark:bg-green-500/5'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Session Info */}
                      <div className="flex items-start gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          session.currentSession
                            ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}>
                          {getDeviceIcon(session.deviceName)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-slate-900 dark:text-white text-sm truncate">
                              {session.deviceName}
                            </h4>
                            {session.currentSession && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 shrink-0">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              IP: {session.ipAddress}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Created: {session.createdAt}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Last active: {session.lastAccessedAt}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Revoke Button (hide for current session) */}
                      {!session.currentSession && (
                        <button
                          onClick={() => handleRevokeSession(session.sessionId)}
                          disabled={revokingId === session.sessionId}
                          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 transition-colors disabled:opacity-50"
                        >
                          {revokingId === session.sessionId ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          {revokingId === session.sessionId ? 'Revoking...' : 'Revoke'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!sessionsLoading && !sessionsError && sessions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                <Shield className="w-10 h-10 mb-3" />
                <p className="text-sm">No active sessions found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
