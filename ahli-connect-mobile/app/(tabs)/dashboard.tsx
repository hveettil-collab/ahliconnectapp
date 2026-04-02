import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useStockPrice } from '@/hooks/useStockPrice';
import { COLORS, SHADOWS } from '@/lib/theme';
import {
  IHC_ANNOUNCEMENTS,
  COMPANY_ANNOUNCEMENTS,
  COMPANIES,
  MARKET_DATA,
} from '@/lib/mockData';
import {
  Bell,
  Star,
  Sparkles,
  Gift,
  Zap,
  Leaf,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

function useGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function useLiveTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat('en-AE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Dubai',
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const QUICK_ACTIONS = [
  { icon: Sparkles, label: 'Ask AI', color: COLORS.textPrimary },
  { icon: Gift, label: 'Benefits', color: COLORS.textPrimary },
  { icon: Zap, label: 'Events', color: COLORS.white },
  { icon: Leaf, label: 'Wellness', color: COLORS.textPrimary },
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const greeting = useGreeting();
  const time = useLiveTime();
  const { stock, loading: stockLoading } = useStockPrice();

  if (!user) return null;

  const company = COMPANIES.find(c => c.id === user.companyId);
  const companyAnns = COMPANY_ANNOUNCEMENTS[user.companyId] || [];
  const allAnns = [...IHC_ANNOUNCEMENTS, ...companyAnns].slice(0, 3);

  const sd = stock ?? {
    ...MARKET_DATA,
    live: false,
    updatedAt: '',
    prevClose: MARKET_DATA.price - MARKET_DATA.change,
  };

  const isUp = sd.change >= 0;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.cream }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ══════════════════════════════════════════ */}
        {/* GREETING HEADER */}
        {/* ══════════════════════════════════════════ */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 12,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.textSecondary,
                  fontWeight: '500',
                  marginBottom: 4,
                }}
              >
                {greeting}
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: COLORS.textPrimary,
                  marginBottom: 4,
                }}
              >
                {user.name.split(' ')[0]}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.textMuted,
                }}
              >
                {time}
              </Text>
            </View>
            <Image
              source={{ uri: user.image }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: COLORS.border,
              }}
            />
          </View>

          {/* Action buttons */}
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              justifyContent: 'flex-end',
            }}
          >
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: COLORS.white,
                justifyContent: 'center',
                alignItems: 'center',
                ...SHADOWS.sm,
              }}
            >
              <Bell size={18} color={COLORS.textPrimary} strokeWidth={1.5} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: COLORS.white,
                justifyContent: 'center',
                alignItems: 'center',
                ...SHADOWS.sm,
              }}
            >
              <Star size={18} color={COLORS.textPrimary} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ══════════════════════════════════════════ */}
        {/* STOCK TICKER CARD */}
        {/* ══════════════════════════════════════════ */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: COLORS.navy,
              borderRadius: 16,
              padding: 16,
              ...SHADOWS.md,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 11,
                    color: COLORS.white,
                    opacity: 0.6,
                    fontWeight: '600',
                    marginBottom: 4,
                  }}
                >
                  IHC STOCK
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: '700',
                    color: COLORS.white,
                  }}
                >
                  AED {sd.price.toFixed(2)}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    marginBottom: 4,
                  }}
                >
                  {isUp ? (
                    <TrendingUp
                      size={16}
                      color={COLORS.green}
                      strokeWidth={2}
                    />
                  ) : (
                    <TrendingDown
                      size={16}
                      color={COLORS.red}
                      strokeWidth={2}
                    />
                  )}
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: isUp ? COLORS.green : COLORS.red,
                    }}
                  >
                    {isUp ? '+' : ''}{sd.change.toFixed(2)}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: isUp ? COLORS.green : COLORS.red,
                    fontWeight: '500',
                  }}
                >
                  {isUp ? '+' : ''}{sd.changePct.toFixed(2)}%
                </Text>
              </View>
            </View>

            {/* Mini chart */}
            <View
              style={{
                height: 40,
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: 3,
              }}
            >
              {sd.chartData.map((point, i) => {
                const maxPrice = Math.max(...sd.chartData.map(p => p.price));
                const minPrice = Math.min(...sd.chartData.map(p => p.price));
                const range = maxPrice - minPrice || 1;
                const height = ((point.price - minPrice) / range) * 40;
                return (
                  <View
                    key={i}
                    style={{
                      flex: 1,
                      height: height || 2,
                      backgroundColor: COLORS.gold,
                      borderRadius: 2,
                    }}
                  />
                );
              })}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 1,
                borderTopColor: 'rgba(255,255,255,0.1)',
                paddingTop: 12,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.white,
                    opacity: 0.5,
                    marginBottom: 4,
                  }}
                >
                  Market Cap
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: COLORS.white,
                  }}
                >
                  {sd.marketCap}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.white,
                    opacity: 0.5,
                    marginBottom: 4,
                  }}
                >
                  Volume
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: COLORS.white,
                  }}
                >
                  {sd.volume}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.white,
                    opacity: 0.5,
                    marginBottom: 4,
                  }}
                >
                  52W High
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: COLORS.white,
                  }}
                >
                  {sd.high52w.toFixed(0)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ══════════════════════════════════════════ */}
        {/* IHC ANNOUNCEMENTS */}
        {/* ══════════════════════════════════════════ */}
        {allAnns.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                paddingHorizontal: 16,
                marginBottom: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: COLORS.textPrimary,
                }}
              >
                Announcements
              </Text>
              <ChevronRight size={20} color={COLORS.textMuted} strokeWidth={1.5} />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
              scrollEventThrottle={16}
            >
              {allAnns.map(ann => (
                <TouchableOpacity
                  key={ann.id}
                  style={{
                    width: 240,
                    backgroundColor: COLORS.white,
                    borderRadius: 12,
                    overflow: 'hidden',
                    ...SHADOWS.sm,
                  }}
                >
                  <Image
                    source={{ uri: ann.image }}
                    style={{
                      width: '100%',
                      height: 120,
                      backgroundColor: COLORS.border,
                    }}
                  />
                  <View style={{ padding: 12 }}>
                    <View style={{ marginBottom: 6 }}>
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '600',
                          color: COLORS.gold,
                          marginBottom: 4,
                        }}
                      >
                        {ann.tag.toUpperCase()}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '700',
                          color: COLORS.textPrimary,
                          lineHeight: 16,
                        }}
                        numberOfLines={2}
                      >
                        {ann.title}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 11,
                        color: COLORS.textMuted,
                        lineHeight: 15,
                      }}
                      numberOfLines={2}
                    >
                      {ann.summary}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ══════════════════════════════════════════ */}
        {/* QUICK ACTIONS GRID */}
        {/* ══════════════════════════════════════════ */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: COLORS.textPrimary,
              marginBottom: 12,
            }}
          >
            Quick Actions
          </Text>

          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            {QUICK_ACTIONS.map((action, i) => {
              const bgColor =
                i === 2 ? COLORS.navy : COLORS.white;
              const textColor =
                i === 2 ? COLORS.white : COLORS.textPrimary;
              const Icon = action.icon;

              return (
                <TouchableOpacity
                  key={i}
                  style={{
                    flex: 1,
                    minWidth: '23%',
                    backgroundColor: bgColor,
                    borderRadius: 12,
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...SHADOWS.sm,
                  }}
                >
                  <Icon
                    size={22}
                    color={action.color}
                    strokeWidth={1.5}
                    style={{ marginBottom: 6 }}
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: textColor,
                      textAlign: 'center',
                    }}
                  >
                    {action.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
