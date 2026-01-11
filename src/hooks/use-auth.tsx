'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getToken, saveToken, removeToken } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

interface User {
  fullName: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to decode JWT
function decodeToken(token: string): User | null {
  try {
    const decoded: any = jwtDecode(token);
    return {
      fullName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
      email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || ''
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getToken();
      if (storedToken) {
        setTokenState(storedToken);
        const decodedUser = decodeToken(storedToken);
        if (decodedUser) {
          setUser(decodedUser);
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (newToken: string) => {
    saveToken(newToken);
    setTokenState(newToken);
    const decodedUser = decodeToken(newToken);
    if (decodedUser) {
      setUser(decodedUser);
    }
  };

  const logout = () => {
    setTokenState(null);
    setUser(null);
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
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
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
