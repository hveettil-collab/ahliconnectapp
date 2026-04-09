'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface InsurancePolicy {
  id: string;
  type: 'car' | 'home' | 'pet' | 'health';
  planName: string;
  premium: number;
  policyNumber: string;
  purchaseDate: string;
  expiryDate: string;
  status: 'active' | 'pending' | 'expired';
  details: Record<string, string>;
}

interface InsuranceContextType {
  policies: InsurancePolicy[];
  addPolicy: (policy: Omit<InsurancePolicy, 'id' | 'policyNumber' | 'purchaseDate' | 'expiryDate' | 'status'>) => void;
  hasPolicyType: (type: string) => boolean;
}

const InsuranceContext = createContext<InsuranceContextType>({
  policies: [],
  addPolicy: () => {},
  hasPolicyType: () => false,
});

export function InsuranceProvider({ children }: { children: ReactNode }) {
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);

  const addPolicy = (policy: Omit<InsurancePolicy, 'id' | 'policyNumber' | 'purchaseDate' | 'expiryDate' | 'status'>) => {
    const now = new Date();
    const expiry = new Date(now);
    expiry.setFullYear(expiry.getFullYear() + 1);

    const newPolicy: InsurancePolicy = {
      ...policy,
      id: `policy_${Date.now()}`,
      policyNumber: `SHR-2026-${Math.floor(Math.random() * 90000 + 10000)}`,
      purchaseDate: now.toISOString().split('T')[0],
      expiryDate: `${expiry.toLocaleString('en-US', { month: 'short' })} ${expiry.getDate()}, ${expiry.getFullYear()}`,
      status: 'active',
    };

    setPolicies(prev => [...prev, newPolicy]);
  };

  const hasPolicyType = (type: string) => policies.some(p => p.type === type && p.status === 'active');

  return (
    <InsuranceContext.Provider value={{ policies, addPolicy, hasPolicyType }}>
      {children}
    </InsuranceContext.Provider>
  );
}

export const useInsurance = () => useContext(InsuranceContext);
