'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/* ═══════════════════════════════════════════
   USER LISTINGS CONTEXT
   ═══════════════════════════════════════════
   Manages user-created marketplace listings from AI sell flow.
   Persists in memory for the session so listings show on marketplace.
*/

export interface UserListing {
  id: string;
  title: string;
  price: string;
  category: string;
  condition: string;
  description: string;
  images: string[]; // base64 data URLs or placeholder URLs
  seller: string;
  sellerCompany: string;
  posted: string;
  featured: boolean;
  specs: Record<string, string>;
}

interface ListingsContextType {
  userListings: UserListing[];
  addListing: (listing: Omit<UserListing, 'id' | 'posted' | 'featured'>) => void;
}

const ListingsContext = createContext<ListingsContextType | null>(null);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [userListings, setUserListings] = useState<UserListing[]>([]);

  const addListing = useCallback((listing: Omit<UserListing, 'id' | 'posted' | 'featured'>) => {
    const newListing: UserListing = {
      ...listing,
      id: `user-${Date.now()}`,
      posted: 'Just now',
      featured: true,
    };
    setUserListings(prev => [newListing, ...prev]);
  }, []);

  return (
    <ListingsContext.Provider value={{ userListings, addListing }}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error('useListings must be used within ListingsProvider');
  return ctx;
}
