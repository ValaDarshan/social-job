import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, User, UserMinus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService, handleApiResponse } from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/api';

export type FollowListType = 'followers' | 'following';

interface FollowUser {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  profileUrl: string | null;
  headLine: string | null;
}

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: FollowListType;
  onCountChange?: () => void;
}

/**
 * Safely extracts an array of FollowUser from the API response data.
 * Handles both direct array and nested object responses (e.g. paginated).
 */
function extractUsers(data: any): FollowUser[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  // Handle paginated / wrapped responses
  if (Array.isArray(data.content)) return data.content;
  if (Array.isArray(data.users)) return data.users;
  if (Array.isArray(data.followers)) return data.followers;
  if (Array.isArray(data.following)) return data.following;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

export default function FollowListModal({ isOpen, onClose, type, onCountChange }: FollowListModalProps) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unfollowingId, setUnfollowingId] = useState<string | null>(null);

  const handleNavigateToProfile = (userId: string) => {
    onClose(); // Close the modal first
    navigate(`/profile/${userId}`);
  };

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const url = type === 'followers'
        ? API_ENDPOINTS.CONNECTIONS.FOLLOWERS
        : API_ENDPOINTS.CONNECTIONS.FOLLOWING;
      const res = await apiService.fetchWithAuth(url);
      if (!res) {
        setError('Failed to connect to server');
        return;
      }
      const result = await handleApiResponse(res, `Failed to load ${type}`);
      setUsers(extractUsers(result.data));
    } catch (err: any) {
      setError(err.message || `Failed to load ${type}`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    if (isOpen) {
      fetchList();
    } else {
      // Reset state when modal closes
      setUsers([]);
      setError('');
      setLoading(true);
    }
  }, [isOpen, fetchList]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleUnfollow = async (userId: string) => {
    setUnfollowingId(userId);
    try {
      const res = await apiService.fetchWithAuth(API_ENDPOINTS.CONNECTIONS.UNFOLLOW(userId), {
        method: 'DELETE',
      });
      await handleApiResponse(res, 'Failed to unfollow');
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
      onCountChange?.();
    } catch (err: any) {
      console.error('Unfollow failed:', err.message);
    } finally {
      setUnfollowingId(null);
    }
  };

  if (!isOpen) return null;

  const title = type === 'followers' ? 'Followers' : 'Following';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 max-h-[80vh] bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <p className="text-sm text-red-500 dark:text-red-400 mb-3">{error}</p>
              <button
                type="button"
                onClick={fetchList}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <User className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-400 dark:text-slate-500">
                {type === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {users.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Avatar + Info — clickable to navigate to profile */}
                  <button
                    type="button"
                    onClick={() => handleNavigateToProfile(user.userId)}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  >
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                      {user.profileUrl ? (
                        <img
                          src={user.profileUrl}
                          alt={user.firstName || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate hover:underline">
                        {user.firstName} {user.lastName}
                      </p>
                      {user.username && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          @{user.username}
                        </p>
                      )}
                      {user.headLine && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {user.headLine}
                        </p>
                      )}
                    </div>
                  </button>

                  {/* Unfollow button — only show for 'following' list */}
                  {type === 'following' && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleUnfollow(user.userId); }}
                      disabled={unfollowingId === user.userId}
                      className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:border-red-500/30 dark:hover:text-red-400 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {unfollowingId === user.userId ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <UserMinus className="w-3 h-3" />
                      )}
                      Unfollow
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
