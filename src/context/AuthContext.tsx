import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  getGoogleAuthUrl,
  exchangeCodeForToken,
  saveAuthToStorage,
  getAuthFromStorage,
  clearAuthStorage,
} from '../services/auth';
import type { AuthContextType, User } from '../types';

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getAuthFromStorage();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(() => {
    window.location.href = getGoogleAuthUrl();
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    clearAuthStorage();
  }, []);

  const handleAuthCallback = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      const result = await exchangeCodeForToken(code);
      setUser(result.user);
      setToken(result.token);
      saveAuthToStorage(result.token, result.user);
    } catch (error) {
      console.error('Auth callback failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    handleAuthCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
