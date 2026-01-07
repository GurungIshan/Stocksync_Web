'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getToken, saveToken, removeToken } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getToken();
      if (storedToken) {
        setTokenState(storedToken);
        try {
          const response = await fetch('https://localhost:7232/api/Auth/user', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
            cache: 'no-store'
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Failed to fetch user on mount", error);
          logout();
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (newToken: string) => {
    setIsLoading(true);
    saveToken(newToken);
    setTokenState(newToken);
     try {
      const userDetailsResponse = await fetch('https://localhost:7232/api/Auth/user', {
        headers: { 'Authorization': `Bearer ${newToken}` },
        cache: 'no-store'
      });
      if (userDetailsResponse.ok) {
        const userData = await userDetailsResponse.json();
        setUser(userData);
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      console.error("Login error:", error);
      logout(); // Clear auth state on error
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
    removeToken();
  };

  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading: isLoading && !user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
