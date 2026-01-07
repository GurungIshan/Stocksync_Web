'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getToken, saveToken, removeToken } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getToken();
      if (storedToken) {
        setTokenState(storedToken);
        // We don't fetch user here anymore, as login flow handles it or subsequent navigation will.
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);


  const login = async (newToken: string) => {
    saveToken(newToken);
    setTokenState(newToken);
    // User will be set by the redirect and the main useEffect
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
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
