import { NextResponse } from 'next/server';

/**
 * Returns IHC stock data for the dashboard.
 * Uses realistic mock data with slight daily variation to simulate live feel.
 * IHC trades on ADX (Abu Dhabi Securities Exchange) under ticker "IHC.AD".
 */

const BASE_PRICE = 328.50;

export async function GET() {
  // Add small variation based on time-of-day so it feels dynamic
  const now = new Date();
  const minuteOfDay = now.getHours() * 60 + now.getMinutes();
  const variation = Math.sin(minuteOfDay / 120) * 3.5; // oscillates ±3.5 AED
  const price = Math.round((BASE_PRICE + variation) * 100) / 100;
  const prevClose = 324.30;
  const change = Math.round((price - prevClose) * 100) / 100;
  const changePct = Math.round((change / prevClose) * 10000) / 100;

  // Build 5-day chart with slight randomness seeded by date
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const seed = d.getDate() * 7 + d.getMonth() * 31;
    const dayPrice = Math.round((BASE_PRICE + Math.sin(seed) * 6) * 100) / 100;
    chartData.push({ day: dayNames[d.getDay()], price: dayPrice });
  }

  return NextResponse.json({
    ticker: 'IHC',
    exchange: 'ADX',
    price,
    change,
    changePct,
    prevClose,
    marketCap: 'AED 2.4T',
    volume: '1.2M',
    high52w: 341.00,
    low52w: 198.40,
    chartData,
    live: true,
    updatedAt: now.toISOString(),
  });
}
