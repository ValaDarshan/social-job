import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ApiResponse } from '../services/apiService';
import { API_ENDPOINTS } from '../config/api';

export interface User {
  userId: string;
  username: string;
  email?: string;
}

/** Decode a JWT payload without a library */
function parseJwt(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshToken }),
      });

      const result: ApiResponse = await response.json();

      if (response.ok && result.success && result.data) {
        const newAccessToken = result.data.accessToken || result.data.token;
        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          return newAccessToken;
        }
      }
      
      // If refresh fails, log the user out
      logout();
      return null;
    } catch (err) {
      console.error('Failed to refresh token:', err);
      logout();
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user: User = JSON.parse(userStr);
        // Backfill userId from JWT if missing (for users who logged in before this change)
        if (!user.userId && token) {
          const payload = parseJwt(token);
          if (payload?.['user-id']) {
            user.userId = payload['user-id'];
            localStorage.setItem('user', JSON.stringify(user));
          }
        }
        setCurrentUser(user);
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, refreshToken: string, user: User) => {
    // Extract userId from JWT if not already present
    if (!user.userId) {
      const payload = parseJwt(token);
      if (payload?.['user-id']) {
        user.userId = payload['user-id'];
      }
    }
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    // Call backend logout to revoke the current session
    if (accessToken) {
      try {
        await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      } catch (err) {
        console.error('Failed to call logout API:', err);
      }
    }

    // Always clear local storage regardless of API result
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
