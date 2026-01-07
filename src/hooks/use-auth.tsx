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
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const response = await fetch('https://localhost:7232/api/Auth/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token might be invalid, so log out
            logout();
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          logout(); // Logout on network or other errors
        }
      }
    };
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (newToken: string) => {
    saveToken(newToken);
    setTokenState(newToken);
    // User will be fetched by the useEffect hook above
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
