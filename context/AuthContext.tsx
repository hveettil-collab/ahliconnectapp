'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_USERS } from '@/lib/mockData';
import { STORAGE_KEYS } from '@/lib/constants';

type User = typeof MOCK_USERS[keyof typeof MOCK_USERS] | null;

interface AuthContextType {
  user: User;
  pendingEmail: string;
  pendingCompany: string;
  setAuth: (email: string, company: string) => void;
  login: (email: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingCompany, setPendingCompany] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const setAuth = (email: string, company: string) => {
    setPendingEmail(email);
    setPendingCompany(company);
  };

  const login = (email: string): boolean => {
    const found = MOCK_USERS[email] || Object.values(MOCK_USERS)[0];
    setUser(found);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(found));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, pendingEmail, pendingCompany, setAuth, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
