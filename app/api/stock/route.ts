import { NextResponse } from 'next/server';

/**
 * Fetches real-time IHC stock data from Yahoo Finance.
 * IHC trades on ADX (Abu Dhabi Securities Exchange) under ticker "IHC.AD".
 * Auto-refreshes every 60s on the client side.
 */

const SYMBOL = 'IHC.AD';
const YF_URL = `https://query1.finance.yahoo.com/v8/finance/chart/${SYMBOL}?interval=1d&range=5d&includePrePost=false`;

interface YFResult {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: number;
        previousClose?: number;
        currency?: string;
        exchangeName?: string;
        symbol?: string;
        fiftyTwoWeekHigh?: number;
        fiftyTwoWeekLow?: number;
        regularMarketVolume?: number;
        marketCap?: number;
      };
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          close?: (number | null)[];
          high?: (number | null)[];
          low?: (number | null)[];
          open?: (number | null)[];
          volume?: (number | null)[];
        }>;
      };
    }>;
    error?: { code?: string; description?: string };
  };
}

export async function GET() {
  try {
    const res = await fetch(YF_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      next: { revalidate: 60 }, // cache for 60s on server
    });

    if (!res.ok) {
      throw new Error(`Yahoo Finance responded ${res.status}`);
    }

    const data: YFResult = await res.json();
    const result = data.chart?.result?.[0];

    if (!result || data.chart?.error) {
      throw new Error(data.chart?.error?.description || 'No data returned');
    }

    const meta = result.meta!;
    const price = meta.regularMarketPrice ?? 0;
    const prevClose = meta.previousClose ?? price;
    const change = price - prevClose;
    const changePct = prevClose > 0 ? (change / prevClose) * 100 : 0;

    // Build chart data from timestamps + close prices
    const timestamps = result.timestamp ?? [];
    const closes = result.indicators?.quote?.[0]?.close ?? [];
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = timestamps
      .map((ts, i) => {
        const d = new Date(ts * 1000);
        return {
          day: DAYS[d.getDay()],
          price: closes[i] ?? 0,
        };
      })
      .filter(d => d.price > 0);

    // Format volume
    const vol = meta.regularMarketVolume ?? 0;
    const volumeStr = vol >= 1_000_000
      ? `${(vol / 1_000_000).toFixed(1)}M`
      : vol >= 1_000
        ? `${(vol / 1_000).toFixed(0)}K`
        : `${vol}`;

    // Market cap
    const mc = meta.marketCap ?? 0;
    const marketCapStr = mc >= 1_000_000_000_000
      ? `AED ${(mc / 1_000_000_000_000).toFixed(1)}T`
      : mc >= 1_000_000_000
        ? `AED ${(mc / 1_000_000_000).toFixed(0)}B`
        : mc > 0
          ? `AED ${(mc / 1_000_000).toFixed(0)}M`
          : 'N/A';

    return NextResponse.json({
      ticker: 'IHC',
      exchange: meta.exchangeName ?? 'ADX',
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePct: Math.round(changePct * 100) / 100,
      prevClose: Math.round(prevClose * 100) / 100,
      marketCap: marketCapStr,
      volume: volumeStr,
      high52w: meta.fiftyTwoWeekHigh ?? 0,
      low52w: meta.fiftyTwoWeekLow ?? 0,
      chartData,
      live: true,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    // Fallback to mock data if the API fails
    console.error('Stock API error:', err);
    return NextResponse.json({
      ticker: 'IHC',
      exchange: 'ADX',
      price: 328.50,
      change: 4.20,
      changePct: 1.30,
      prevClose: 324.30,
      marketCap: 'AED 2.4T',
      volume: '1.2M',
      high52w: 341.00,
      low52w: 198.40,
      chartData: [
        { day: 'Mon', price: 320 },
        { day: 'Tue', price: 315 },
        { day: 'Wed', price: 322 },
        { day: 'Thu', price: 318 },
        { day: 'Fri', price: 324 },
        { day: 'Sat', price: 328.5 },
      ],
      live: false,
      updatedAt: new Date().toISOString(),
    });
  }
}
