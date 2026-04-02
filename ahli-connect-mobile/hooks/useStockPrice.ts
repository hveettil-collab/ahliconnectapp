import { useState, useEffect, useCallback } from 'react';

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

export function useStockPrice() {
  const [stock, setStock] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = useCallback(async () => {
    try {
      const res = await fetch('/api/stock', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: StockData = await res.json();
      setStock(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock();
    const id = setInterval(fetchStock, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [fetchStock]);

  return { stock, loading, error, refetch: fetchStock };
}
