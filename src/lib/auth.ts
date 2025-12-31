'use client';

export function saveToken(token: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
    }
}

export function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
}

export function removeToken() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
    }
}
