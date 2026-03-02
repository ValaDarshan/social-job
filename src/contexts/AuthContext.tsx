import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ApiResponse } from '../services/apiService';

export interface User {
  username: string;
  email?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
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
      const response = await fetch('http://localhost:9012/auth/refresh-token', {
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
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, refreshToken: string, user: User) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
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
