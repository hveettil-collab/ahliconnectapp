import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { COLORS, SHADOWS } from '@/lib/theme';
import { COMPANIES } from '@/lib/mockData';
import {
  Sparkles,
  TrendingUp,
  Heart,
  Gift,
  Calendar,
  Plane,
  Car,
  ShoppingBag,
  Gamepad2,
  Shield,
  Receipt,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const FILTER_CHIPS = [
  { label: 'For You', icon: Sparkles, id: 'for-you' },
  { label: 'Trending', icon: TrendingUp, id: 'trending' },
  { label: 'Wellness', icon: Heart, id: 'wellness' },
  { label: 'Offers', icon: Gift, id: 'offers' },
  { label: 'Events', icon: Calendar, id: 'events' },
];

const FEATURED_HEROES = [
  {
    id: 'hero1',
    title: 'Employee Wellness Week',
    subtitle: 'Free health screenings & wellness activities',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop',
    tag: 'Wellness',
    tagColor: COLORS.green,
    cta: 'Register Now',
    countdown: 'Starts Apr 25',
  },
  {
    id: 'hero2',
    title: 'IHC Innovation Hackathon',
    subtitle: '48-hour AI hackathon with AED 50K prizes',
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop',
    tag: 'Innovation',
    tagColor: '#7C3AED',
    cta: 'Join Now',
    countdown: 'Apr 18–20',
  },
];

const QUICK_ACTIONS = [
  { icon: Plane, label: 'Flights', color: COLORS.navy },
  { icon: Car, label: 'Rides', color: '#0D9488' },
  { icon: ShoppingBag, label: 'Marketplace', color: COLORS.gold },
  { icon: Gamepad2, label: 'Gaming', color: COLORS.red },
  { icon: Shield, label: 'Insurance', color: '#7C3AED' },
  { icon: Receipt, label: 'Payslip', color: COLORS.green },
];

const COMPANY_FEATURES = [
  { id: 'aldar', name: 'Aldar', color: COLORS.gold },
  { id: 'purehealth', name: 'PureHealth', color: COLORS.green },
  { id: 'palms', name: 'Palms Sports', color: '#EA580C' },
  { id: 'shory', name: 'Shory', color: '#0D9488' },
  { id: 'easylease', name: 'EasyLease', color: '#7C3AED' },
  { id: 'ghitha', name: 'Ghitha', color: COLORS.red },
];

export default function ExploreScreen() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('for-you');
  const [heroIdx, setHeroIdx] = useState(0);

  if (!user) return null;

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
        {/* HEADER */}
        {/* ══════════════════════════════════════════ */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: COLORS.textPrimary,
            }}
          >
            Explore
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: COLORS.textMuted,
              marginTop: 4,
            }}
          >
            Discover what's new at IHC
          </Text>
        </View>

        {/* ══════════════════════════════════════════ */}
        {/* FILTER CHIPS */}
        {/* ══════════════════════════════════════════ */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 16 }}
          scrollEventThrottle={16}
        >
          {FILTER_CHIPS.map(chip => {
            const isActive = activeFilter === chip.id;
            const Icon = chip.icon;
            return (
              <TouchableOpacity
                key={chip.id}
                onPress={() => setActiveFilter(chip.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: isActive ? COLORS.navy : COLORS.white,
                  borderWidth: isActive ? 0 : 1,
                  borderColor: COLORS.border,
                  ...SHADOWS.sm,
                }}
              >
                <Icon
                  size={16}
                  color={isActive ? COLORS.white : COLORS.textPrimary}
                  strokeWidth={1.5}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: isActive ? COLORS.white : COLORS.textPrimary,
                  }}
                >
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ══════════════════════════════════════════ */}
        {/* FEATURED HERO CAROUSEL */}
        {/* ══════════════════════════════════════════ */}
        <View style={{ marginBottom: 24 }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            scrollEventThrottle={16}
          >
            {FEATURED_HEROES.map((hero, i) => (
              <TouchableOpacity
                key={hero.id}
                style={{
                  width: width - 32,
                  height: 200,
                  borderRadius: 16,
                  overflow: 'hidden',
                  ...SHADOWS.md,
                }}
              >
                <Image
                  source={{ uri: hero.image }}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: COLORS.border,
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    justifyContent: 'flex-end',
                    padding: 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '700',
                          color: COLORS.white,
                          opacity: 0.7,
                          marginBottom: 4,
                          textTransform: 'uppercase',
                        }}
                      >
                        {hero.tag}
                      </Text>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: '700',
                          color: COLORS.white,
                          lineHeight: 22,
                          marginBottom: 4,
                        }}
                        numberOfLines={2}
                      >
                        {hero.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: COLORS.white,
                          opacity: 0.8,
                        }}
                      >
                        {hero.countdown}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: hero.tagColor,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        marginLeft: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: '700',
                          color: COLORS.white,
                        }}
                      >
                        {hero.cta}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Carousel indicators */}
          <View
            style={{
              flexDirection: 'row',
              gap: 6,
              justifyContent: 'center',
              marginTop: 12,
            }}
          >
            {FEATURED_HEROES.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setHeroIdx(i)}
                style={{
                  width: heroIdx === i ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    heroIdx === i ? COLORS.navy : COLORS.border,
                }}
              />
            ))}
          </View>
        </View>

        {/* ══════════════════════════════════════════ */}
        {/* QUICK ACTIONS GRID (3x2) */}
        {/* ══════════════════════════════════════════ */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
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
              justifyContent: 'space-between',
            }}
          >
            {QUICK_ACTIONS.map((action, i) => {
              const Icon = action.icon;
              return (
                <TouchableOpacity
                  key={i}
                  style={{
                    width: '31.5%',
                    backgroundColor: COLORS.white,
                    borderRadius: 12,
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...SHADOWS.sm,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: action.color,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Icon
                      size={20}
                      color={COLORS.white}
                      strokeWidth={2}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: COLORS.textPrimary,
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

        {/* ══════════════════════════════════════════ */}
        {/* IHC SUBSIDIARIES GRID */}
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
            IHC Subsidiaries
          </Text>

          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {COMPANY_FEATURES.map(company => {
              const companyData = COMPANIES.find(c => c.id === company.id);
              return (
                <TouchableOpacity
                  key={company.id}
                  style={{
                    width: '31.5%',
                    backgroundColor: COLORS.white,
                    borderRadius: 12,
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderLeftWidth: 4,
                    borderLeftColor: company.color,
                    ...SHADOWS.sm,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: company.color,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '700',
                        color: COLORS.white,
                      }}
                    >
                      {companyData?.short}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: COLORS.textPrimary,
                      textAlign: 'center',
                      lineHeight: 14,
                    }}
                    numberOfLines={2}
                  >
                    {company.name}
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
