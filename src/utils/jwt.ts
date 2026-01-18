'use client';

import { getToken } from '@/lib/auth';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
  [key: string]: any;
}

export function getUserIdFromToken(): string | null {
  const token = getToken();
  if (!token) {
    return null;
  }
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    return userId || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
