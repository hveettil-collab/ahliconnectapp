import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import { MOCK_USERS } from '@/lib/mockData';

type User = typeof MOCK_USERS[keyof typeof MOCK_USERS] | null;

interface AuthContextType {
  user: User;
  pendingEmail: string;
  pendingCompany: string;
  setAuth: (email: string, company: string) => void;
  login: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingCompany, setPendingCompany] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const stored = await AsyncStorage.getItem('ahli_user');
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (error) {
        if (__DEV__) console.error('Failed to restore auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuth();
  }, []);

  // Navigation effect based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(app)/home');
    }
  }, [user, segments, isLoading, router]);

  const setAuth = (email: string, company: string) => {
    setPendingEmail(email);
    setPendingCompany(company);
  };

  const login = async (email: string): Promise<boolean> => {
    try {
      const found = MOCK_USERS[email] || Object.values(MOCK_USERS)[0];
      setUser(found);
      await AsyncStorage.setItem('ahli_user', JSON.stringify(found));
      return true;
    } catch (error) {
      if (__DEV__) console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('ahli_user');
    } catch (error) {
      if (__DEV__) console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        pendingEmail,
        pendingCompany,
        setAuth,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
