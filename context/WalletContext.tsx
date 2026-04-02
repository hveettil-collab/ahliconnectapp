'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/* ═══════════════════════════════════════════
   WALLET & REWARDS CONTEXT
   ═══════════════════════════════════════════
   Manages:
   - AED wallet balance (fundable, used for in-app purchases)
   - Reward points (earned through performance & innovation)
   - Transaction history for both
*/

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  label: string;
  category: 'fund' | 'purchase' | 'reward' | 'refund';
  timestamp: Date;
  icon?: string;
}

export interface RewardEntry {
  id: string;
  points: number;
  reason: string;
  category: 'performance' | 'innovation' | 'engagement' | 'recognition' | 'referral';
  date: Date;
}

interface WalletState {
  balance: number;
  rewardPoints: number;
  transactions: Transaction[];
  rewardHistory: RewardEntry[];
  rewardTier: string;
  rewardTierColor: string;
  rewardTierNext: string;
  rewardProgress: number;
}

interface WalletContextType extends WalletState {
  fundWallet: (amount: number) => void;
  makePayment: (amount: number, label: string) => boolean;
  addRewardPoints: (points: number, reason: string, category: RewardEntry['category']) => void;
  redeemPoints: (points: number) => boolean;
  getPointsValue: (points: number) => number;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// 1 point = AED 0.10
const POINTS_TO_AED = 0.10;

function getTier(points: number): { tier: string; color: string; next: string; progress: number } {
  if (points >= 10000) return { tier: 'Platinum', color: '#9D63F6', next: 'Max Level', progress: 100 };
  if (points >= 5000) return { tier: 'Gold', color: '#FFBD4C', next: 'Platinum (10,000 pts)', progress: ((points - 5000) / 5000) * 100 };
  if (points >= 2000) return { tier: 'Silver', color: '#A4ABB8', next: 'Gold (5,000 pts)', progress: ((points - 2000) / 3000) * 100 };
  return { tier: 'Bronze', color: '#CD7F32', next: 'Silver (2,000 pts)', progress: (points / 2000) * 100 };
}

// Seed data — realistic transaction history
const SEED_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'credit', amount: 5000, label: 'Wallet Top-Up', category: 'fund', timestamp: new Date(Date.now() - 30 * 86400000) },
  { id: 't2', type: 'debit', amount: 1240, label: 'Shory Motor Insurance', category: 'purchase', timestamp: new Date(Date.now() - 25 * 86400000) },
  { id: 't3', type: 'credit', amount: 2000, label: 'Wallet Top-Up', category: 'fund', timestamp: new Date(Date.now() - 20 * 86400000) },
  { id: 't4', type: 'debit', amount: 450, label: 'Flight Booking — Dubai', category: 'purchase', timestamp: new Date(Date.now() - 15 * 86400000) },
  { id: 't5', type: 'debit', amount: 85, label: 'Food Order — Sushi Lab', category: 'purchase', timestamp: new Date(Date.now() - 10 * 86400000) },
  { id: 't6', type: 'credit', amount: 500, label: 'Reward Points Redemption', category: 'reward', timestamp: new Date(Date.now() - 5 * 86400000) },
  { id: 't7', type: 'debit', amount: 125, label: 'Food Order — Shake Shack', category: 'purchase', timestamp: new Date(Date.now() - 2 * 86400000) },
];

const SEED_REWARDS: RewardEntry[] = [
  { id: 'r1', points: 500, reason: 'Q4 Performance Excellence', category: 'performance', date: new Date(Date.now() - 60 * 86400000) },
  { id: 'r2', points: 1000, reason: 'AI Workflow Innovation Award', category: 'innovation', date: new Date(Date.now() - 45 * 86400000) },
  { id: 'r3', points: 250, reason: 'Monthly Engagement Champion', category: 'engagement', date: new Date(Date.now() - 30 * 86400000) },
  { id: 'r4', points: 500, reason: 'Peer Recognition — Project Lead', category: 'recognition', date: new Date(Date.now() - 15 * 86400000) },
  { id: 'r5', points: 750, reason: 'Process Improvement Idea Implemented', category: 'innovation', date: new Date(Date.now() - 7 * 86400000) },
  { id: 'r6', points: 200, reason: 'Referred 2 New Colleagues', category: 'referral', date: new Date(Date.now() - 3 * 86400000) },
];

const SEED_BALANCE = 5600;
const SEED_POINTS = 3200;

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(SEED_BALANCE);
  const [rewardPoints, setRewardPoints] = useState(SEED_POINTS);
  const [transactions, setTransactions] = useState<Transaction[]>(SEED_TRANSACTIONS);
  const [rewardHistory, setRewardHistory] = useState<RewardEntry[]>(SEED_REWARDS);

  const tier = getTier(rewardPoints);

  const fundWallet = useCallback((amount: number) => {
    setBalance(prev => prev + amount);
    setTransactions(prev => [{
      id: `t${Date.now()}`,
      type: 'credit',
      amount,
      label: 'Wallet Top-Up',
      category: 'fund',
      timestamp: new Date(),
    }, ...prev]);
  }, []);

  const makePayment = useCallback((amount: number, label: string): boolean => {
    if (amount > balance) return false;
    setBalance(prev => prev - amount);
    setTransactions(prev => [{
      id: `t${Date.now()}`,
      type: 'debit',
      amount,
      label,
      category: 'purchase',
      timestamp: new Date(),
    }, ...prev]);
    // Award 1 point per AED 10 spent
    const earnedPoints = Math.floor(amount / 10);
    if (earnedPoints > 0) {
      setRewardPoints(prev => prev + earnedPoints);
      setRewardHistory(prev => [{
        id: `r${Date.now()}`,
        points: earnedPoints,
        reason: `Purchase: ${label}`,
        category: 'engagement',
        date: new Date(),
      }, ...prev]);
    }
    return true;
  }, [balance]);

  const addRewardPoints = useCallback((points: number, reason: string, category: RewardEntry['category']) => {
    setRewardPoints(prev => prev + points);
    setRewardHistory(prev => [{
      id: `r${Date.now()}`,
      points,
      reason,
      category,
      date: new Date(),
    }, ...prev]);
  }, []);

  const redeemPoints = useCallback((points: number): boolean => {
    if (points > rewardPoints) return false;
    const aedValue = points * POINTS_TO_AED;
    setRewardPoints(prev => prev - points);
    setBalance(prev => prev + aedValue);
    setTransactions(prev => [{
      id: `t${Date.now()}`,
      type: 'credit',
      amount: aedValue,
      label: `Redeemed ${points.toLocaleString()} Reward Points`,
      category: 'reward',
      timestamp: new Date(),
    }, ...prev]);
    return true;
  }, [rewardPoints]);

  const getPointsValue = useCallback((points: number) => points * POINTS_TO_AED, []);

  return (
    <WalletContext.Provider value={{
      balance,
      rewardPoints,
      transactions,
      rewardHistory,
      rewardTier: tier.tier,
      rewardTierColor: tier.color,
      rewardTierNext: tier.next,
      rewardProgress: tier.progress,
      fundWallet,
      makePayment,
      addRewardPoints,
      redeemPoints,
      getPointsValue,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
}
