import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, UserPlus, UserCheck, UserMinus, UserX, Clock, Loader2,
  AlertTriangle, Check, X, User, Send, Inbox,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { apiService, handleApiResponse } from '../services/apiService';
import { API_ENDPOINTS } from '../config/api';

// ── Types ─────────────────────────────────────────────────────────────────
interface ConnectionUser {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  profileUrl: string | null;
  headLine: string | null;
}

interface ConnectionRequest {
  connectionId: number;
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  profileUrl: string | null;
  headLine: string | null;
  createdAt: string;
}

type TabKey = 'received' | 'sent' | 'followers' | 'following';

// ── Helpers ───────────────────────────────────────────────────────────────
function extractList<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.content)) return data.content;
  if (Array.isArray(data.connections)) return data.connections;
  if (Array.isArray(data.requests)) return data.requests;
  if (Array.isArray(data.users)) return data.users;
  if (Array.isArray(data.followers)) return data.followers;
  if (Array.isArray(data.following)) return data.following;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

// ═══════════════════════════════════════════════════════════════════════════
export default function Network() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('received');

  // Data
  const [receivedRequests, setReceivedRequests] = useState<ConnectionRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [followers, setFollowers] = useState<ConnectionUser[]>([]);
  const [following, setFollowing] = useState<ConnectionUser[]>([]);

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | number | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // ── Fetch functions ───────────────────────────────────────────────────
  const fetchReceivedRequests = useCallback(async () => {
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.CONNECTIONS.PENDING_RECEIVED);
      const result = await handleApiResponse(res, 'Failed to load received requests');
      setReceivedRequests(extractList<ConnectionRequest>(result.data));
    } catch (err: any) {
      throw err;
    }
  }, []);

  const fetchSentRequests = useCallback(async () => {
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.CONNECTIONS.PENDING_SENT);
      const result = await handleApiResponse(res, 'Failed to load sent requests');
      setSentRequests(extractList<ConnectionRequest>(result.data));
    } catch (err: any) {
      throw err;
    }
  }, []);

  const fetchFollowers = useCallback(async () => {
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.CONNECTIONS.FOLLOWERS);
      const result = await handleApiResponse(res, 'Failed to load followers');
      setFollowers(extractList<ConnectionUser>(result.data));
    } catch (err: any) {
      throw err;
    }
  }, []);

  const fetchFollowing = useCallback(async () => {
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.CONNECTIONS.FOLLOWING);
      const result = await handleApiResponse(res, 'Failed to load following');
      setFollowing(extractList<ConnectionUser>(result.data));
    } catch (err: any) {
      throw err;
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([
        fetchReceivedRequests(),
        fetchSentRequests(),
        fetchFollowers(),
        fetchFollowing(),
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to load network data');
    } finally {
      setLoading(false);
    }
  }, [fetchReceivedRequests, fetchSentRequests, fetchFollowers, fetchFollowing]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Auto-dismiss success messages
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // ── Actions ───────────────────────────────────────────────────────────
  const handleAcceptRequest = async (connectionId: number) => {
    setActionId(connectionId);
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.CONNECTIONS.ACCEPT(connectionId), {
        method: 'PUT',
      });
      const result = await handleApiResponse(res, 'Failed to accept request');
      setSuccessMsg(result.message || 'Request accepted');
      setReceivedRequests((prev) => prev.filter((r) => r.connectionId !== connectionId));
      // Refresh followers since accepting adds them
      fetchFollowers();
      fetchFollowing();
    } catch (err: any) {
      setError(err.message || 'Failed to accept request');
    } finally {
      setActionId(null);
    }
  };

  const handleRejectRequest = async (connectionId: number) => {
    setActionId(connectionId);
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.CONNECTIONS.REJECT(connectionId), {
        method: 'DELETE',
      });
      const result = await handleApiResponse(res, 'Failed to reject request');
      setSuccessMsg(result.message || 'Request rejected');
      setReceivedRequests((prev) => prev.filter((r) => r.connectionId !== connectionId));
    } catch (err: any) {
      setError(err.message || 'Failed to reject request');
    } finally {
      setActionId(null);
    }
  };

  const handleUnfollow = async (userId: string) => {
    setActionId(userId);
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.CONNECTIONS.UNFOLLOW(userId), {
        method: 'DELETE',
      });
      const result = await handleApiResponse(res, 'Failed to unfollow');
      setSuccessMsg(result.message || 'Unfollowed successfully');
      setFollowing((prev) => prev.filter((u) => u.userId !== userId));
    } catch (err: any) {
      setError(err.message || 'Failed to unfollow');
    } finally {
      setActionId(null);
    }
  };

  const handleCancelRequest = async (userId: string) => {
    setActionId(userId);
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.CONNECTIONS.UNFOLLOW(userId), {
        method: 'DELETE',
      });
      const result = await handleApiResponse(res, 'Failed to cancel request');
      setSuccessMsg(result.message || 'Request cancelled');
      setSentRequests((prev) => prev.filter((r) => r.userId !== userId));
    } catch (err: any) {
      setError(err.message || 'Failed to cancel request');
    } finally {
      setActionId(null);
    }
  };

  const handleNavigateToProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  // ── Tab config ────────────────────────────────────────────────────────
  const tabs: { key: TabKey; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'received', label: 'Received', icon: <Inbox className="w-4 h-4" />, count: receivedRequests.length },
    { key: 'sent',     label: 'Sent',     icon: <Send className="w-4 h-4" />,  count: sentRequests.length },
    { key: 'followers', label: 'Followers', icon: <Users className="w-4 h-4" />, count: followers.length },
    { key: 'following', label: 'Following', icon: <UserCheck className="w-4 h-4" />, count: following.length },
  ];

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] transition-colors duration-200">
      <TopNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">My Network</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your connections, requests, and network
            </p>
          </div>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
            <button type="button" onClick={() => setError('')} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs + Content Card */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-slate-200 dark:border-slate-700 flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs sm:text-sm font-semibold transition-colors relative ${
                  activeTab === tab.key
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab.key
                      ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                {/* ─ Received Requests Tab ─ */}
                {activeTab === 'received' && (
                  <div>
                    {receivedRequests.length === 0 ? (
                      <EmptyState icon={<Inbox className="w-10 h-10" />} text="No pending requests" subtext="When someone sends you a connection request, it will appear here." />
                    ) : (
                      <div className="space-y-3">
                        {receivedRequests.map((req) => (
                          <div
                            key={req.connectionId}
                            className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-[#0F172A]/50 hover:border-blue-300 dark:hover:border-blue-500/40 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              {/* Avatar + Info — clickable */}
                              <button
                                type="button"
                                onClick={() => handleNavigateToProfile(req.userId)}
                                className="flex items-center gap-3 flex-1 min-w-0 text-left"
                              >
                                <Avatar url={req.profileUrl} name={req.firstName} />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate hover:underline">
                                    {req.firstName} {req.lastName}
                                  </p>
                                  {req.username && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{req.username}</p>
                                  )}
                                  {req.headLine && (
                                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{req.headLine}</p>
                                  )}
                                  {req.createdAt && (
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> {req.createdAt}
                                    </p>
                                  )}
                                </div>
                              </button>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleAcceptRequest(req.connectionId)}
                                  disabled={actionId === req.connectionId}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                  {actionId === req.connectionId ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5" />
                                  )}
                                  <span className="hidden sm:inline">Accept</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectRequest(req.connectionId)}
                                  disabled={actionId === req.connectionId}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:hover:border-red-500/30 transition-colors disabled:opacity-50"
                                >
                                  {actionId === req.connectionId ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <X className="w-3.5 h-3.5" />
                                  )}
                                  <span className="hidden sm:inline">Reject</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ─ Sent Requests Tab ─ */}
                {activeTab === 'sent' && (
                  <div>
                    {sentRequests.length === 0 ? (
                      <EmptyState icon={<Send className="w-10 h-10" />} text="No pending sent requests" subtext="Connection requests you've sent will appear here." />
                    ) : (
                      <div className="space-y-3">
                        {sentRequests.map((req) => (
                          <div
                            key={req.connectionId}
                            className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-[#0F172A]/50 hover:border-blue-300 dark:hover:border-blue-500/40 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() => handleNavigateToProfile(req.userId)}
                                className="flex items-center gap-3 flex-1 min-w-0 text-left"
                              >
                                <Avatar url={req.profileUrl} name={req.firstName} />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate hover:underline">
                                    {req.firstName} {req.lastName}
                                  </p>
                                  {req.username && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{req.username}</p>
                                  )}
                                  {req.headLine && (
                                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{req.headLine}</p>
                                  )}
                                  {req.createdAt && (
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> {req.createdAt}
                                    </p>
                                  )}
                                </div>
                              </button>

                              {/* Pending badge + Cancel */}
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">
                                  <Clock className="w-3 h-3" />
                                  Pending
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCancelRequest(req.userId)}
                                  disabled={actionId === req.userId}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:hover:border-red-500/30 transition-colors disabled:opacity-50"
                                >
                                  {actionId === req.userId ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <UserX className="w-3.5 h-3.5" />
                                  )}
                                  <span className="hidden sm:inline">Cancel</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ─ Followers Tab ─ */}
                {activeTab === 'followers' && (
                  <div>
                    {followers.length === 0 ? (
                      <EmptyState icon={<Users className="w-10 h-10" />} text="No followers yet" subtext="People who follow you will appear here." />
                    ) : (
                      <div className="space-y-3">
                        {followers.map((user) => (
                          <div
                            key={user.userId}
                            className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-[#0F172A]/50 hover:border-blue-300 dark:hover:border-blue-500/40 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() => handleNavigateToProfile(user.userId)}
                                className="flex items-center gap-3 flex-1 min-w-0 text-left"
                              >
                                <Avatar url={user.profileUrl} name={user.firstName} />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate hover:underline">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  {user.username && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{user.username}</p>
                                  )}
                                  {user.headLine && (
                                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{user.headLine}</p>
                                  )}
                                </div>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ─ Following Tab ─ */}
                {activeTab === 'following' && (
                  <div>
                    {following.length === 0 ? (
                      <EmptyState icon={<UserCheck className="w-10 h-10" />} text="Not following anyone" subtext="People you follow will appear here." />
                    ) : (
                      <div className="space-y-3">
                        {following.map((user) => (
                          <div
                            key={user.userId}
                            className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-[#0F172A]/50 hover:border-blue-300 dark:hover:border-blue-500/40 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() => handleNavigateToProfile(user.userId)}
                                className="flex items-center gap-3 flex-1 min-w-0 text-left"
                              >
                                <Avatar url={user.profileUrl} name={user.firstName} />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate hover:underline">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  {user.username && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{user.username}</p>
                                  )}
                                  {user.headLine && (
                                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{user.headLine}</p>
                                  )}
                                </div>
                              </button>

                              {/* Unfollow */}
                              <button
                                type="button"
                                onClick={() => handleUnfollow(user.userId)}
                                disabled={actionId === user.userId}
                                className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:hover:border-red-500/30 transition-colors disabled:opacity-50"
                              >
                                {actionId === user.userId ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <UserMinus className="w-3.5 h-3.5" />
                                )}
                                <span className="hidden sm:inline">Unfollow</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Shared Components ─────────────────────────────────────────────────────
function Avatar({ url, name }: { url: string | null; name: string }) {
  return (
    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
      {url ? (
        <img src={url} alt={name || 'User'} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <User className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, text, subtext }: { icon: React.ReactNode; text: string; subtext?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-300 dark:text-slate-600">
      {icon}
      <p className="mt-3 text-sm font-medium text-slate-400 dark:text-slate-500">{text}</p>
      {subtext && (
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 max-w-xs text-center">{subtext}</p>
      )}
    </div>
  );
}
