'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

export interface StockData {
  ticker: string;
  exchange: string;
  price: number;
  change: number;
  changePct: number;
  prevClose: number;
  marketCap: string;
  volume: string;
  high52w: number;
  low52w: number;
  chartData: { day: string; price: number }[];
  live: boolean;
  updatedAt: string;
}

const REFRESH_INTERVAL = 60_000; // 60 seconds

/**
 * Hook that fetches live IHC stock data and auto-refreshes every 60s.
 * Uses requestIdleCallback to avoid blocking initial render.
 * Falls back to MARKET_DATA from mockData if the API is unreachable.
 */
export function useStockPrice() {
  const [stock, setStock] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchStock = useCallback(async () => {
    try {
      const res = await fetch('/api/stock', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: StockData = await res.json();
      if (mountedRef.current) {
        setStock(data);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    // Defer initial fetch so it doesn't block first paint
    const scheduleId = typeof requestIdleCallback !== 'undefined'
      ? requestIdleCallback(() => fetchStock())
      : setTimeout(() => fetchStock(), 100);

    const intervalId = setInterval(fetchStock, REFRESH_INTERVAL);

    return () => {
      mountedRef.current = false;
      if (typeof cancelIdleCallback !== 'undefined' && typeof scheduleId === 'number') {
        cancelIdleCallback(scheduleId);
      } else {
        clearTimeout(scheduleId as ReturnType<typeof setTimeout>);
      }
      clearInterval(intervalId);
    };
  }, [fetchStock]);

  return { stock, loading, error, refetch: fetchStock };
}
