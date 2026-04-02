import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { COMPANIES, MARKETPLACE_LISTINGS, OFFERS } from '@/lib/mockData';
import {
  Building2,
  Briefcase,
  Hash,
  Mail,
  MapPin,
  CheckCircle2,
  Bell,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  Tag,
  ShoppingBag,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!user) return null;

  const company = COMPANIES.find((c) => c.id === user.companyId);
  const myListings = MARKETPLACE_LISTINGS.slice(0, 2);
  const savedOffers = OFFERS.slice(0, 3);

  const SETTINGS_SECTIONS = [
    { icon: Bell, label: 'Notification Preferences', desc: 'Manage alerts & emails' },
    { icon: Shield, label: 'Privacy & Security', desc: 'Password, 2FA, sessions' },
    { icon: Settings, label: 'App Preferences', desc: 'Language, theme, display' },
  ];

  const handleSettingPress = (label: string) => {
    Alert.alert(label, 'This feature will be available soon');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const AvatarWithInitials = () => {
    const initials = user.avatar || 'US';
    const bgColor = company?.color || '#1B3A6B';

    if (user.image) {
      return (
        <Image
          source={{ uri: user.image }}
          className="w-20 h-20 rounded-full bg-[#F4EFE8]"
        />
      );
    }

    return (
      <View
        className="w-20 h-20 rounded-full items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <Text className="text-white text-lg font-bold">{initials}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-xl font-bold text-[#1A1A2E]">My Profile</Text>
        </View>

        {/* Profile Card */}
        <View className="mx-4 mt-4 bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden">
          {/* Header background */}
          <View
            className="h-16"
            style={{
              backgroundColor: company?.color || '#1B3A6B',
            }}
          />

          {/* Main info */}
          <View className="px-4 pb-4 -mt-10">
            <View className="flex-row items-end justify-between mb-4">
              <View className="border-4 border-white rounded-full">
                <AvatarWithInitials />
              </View>
              <TouchableOpacity className="flex-row items-center gap-1 bg-[#F4EFE8] px-3 py-2 rounded-lg">
                <Settings size={12} color="#1B3A6B" strokeWidth={2} />
                <Text className="text-xs font-semibold text-[#1B3A6B]">Edit</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-lg font-bold text-[#1A1A2E] mb-0.5">
              {user.name}
            </Text>
            <Text className="text-sm text-[#6B7280] mb-3">{user.title}</Text>

            {/* Badges */}
            <View className="flex-row flex-wrap gap-2 mb-4">
              <View className="bg-[#D1FAE5] px-3 py-1 rounded-full flex-row items-center gap-1">
                <CheckCircle2 size={11} color="#065F46" strokeWidth={2} />
                <Text className="text-xs font-semibold text-[#065F46]">
                  Verified Employee
                </Text>
              </View>
              <View className="bg-[#E8EFF8] px-3 py-1 rounded-full">
                <Text className="text-xs font-semibold text-[#1B3A6B]">
                  {company?.short}
                </Text>
              </View>
            </View>

            {/* Details */}
            <View className="space-y-2.5">
              {[
                { icon: Building2, label: user.company },
                { icon: Briefcase, label: user.department },
                { icon: Hash, label: user.employeeId },
                { icon: Mail, label: user.email },
                { icon: MapPin, label: user.location },
              ].map(({ icon: Icon, label }, idx) => (
                <View key={idx} className="flex-row items-center gap-2">
                  <Icon size={14} color="#9CA3AF" strokeWidth={1.8} />
                  <Text className="text-sm text-[#6B7280]" numberOfLines={1}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View className="mx-4 mt-4 bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden">
          <View className="px-4 py-3 border-b border-[#F4EFE8]">
            <Text className="text-sm font-bold text-[#1A1A2E]">Settings</Text>
          </View>

          {SETTINGS_SECTIONS.map(({ icon: Icon, label, desc }, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleSettingPress(label)}
              className="flex-row items-center gap-3 px-4 py-3 border-b border-[#F4EFE8]"
            >
              <View className="w-9 h-9 bg-[#F4EFE8] rounded-lg items-center justify-center">
                <Icon size={15} color="#6B7280" strokeWidth={1.8} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-[#1A1A2E]">{label}</Text>
                <Text className="text-xs text-[#9CA3AF] mt-0.5">{desc}</Text>
              </View>
              <ChevronRight size={16} color="#9CA3AF" strokeWidth={1.5} />
            </TouchableOpacity>
          ))}

          {/* Logout */}
          <TouchableOpacity
            onPress={() => setShowLogoutConfirm(true)}
            className="flex-row items-center gap-3 px-4 py-3 bg-red-50"
          >
            <View className="w-9 h-9 bg-red-100 rounded-lg items-center justify-center">
              <LogOut size={15} color="#EF4444" strokeWidth={1.8} />
            </View>
            <Text className="text-sm font-medium text-red-500">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Saved Offers Section */}
        <View className="mx-4 mt-4 bg-white rounded-2xl border border-[#E8E2D9] p-4 mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <Tag size={16} color="#1B3A6B" strokeWidth={1.8} />
            <Text className="text-sm font-bold text-[#1A1A2E]">Saved Offers</Text>
          </View>

          <View>
            {savedOffers.map((offer, idx) => (
              <View
                key={offer.id}
                className={`flex-row items-center gap-3 p-3 bg-[#F9F6F1] rounded-lg border border-[#E8E2D9] ${
                  idx !== savedOffers.length - 1 ? 'mb-2' : ''
                }`}
              >
                <View
                  className="w-10 h-10 rounded-lg items-center justify-center"
                  style={{ backgroundColor: offer.color }}
                >
                  <Text className="text-white text-xs font-bold">
                    {offer.company.slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold text-[#1A1A2E]"
                    numberOfLines={1}
                  >
                    {offer.title}
                  </Text>
                  <Text
                    className="text-xs font-medium mt-0.5"
                    style={{ color: offer.color }}
                  >
                    {offer.value}
                  </Text>
                </View>
                <Text className="text-xs text-[#9CA3AF]">{offer.company}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* My Listings Section */}
        <View className="mx-4 mt-4 bg-white rounded-2xl border border-[#E8E2D9] p-4 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <ShoppingBag size={16} color="#1B3A6B" strokeWidth={1.8} />
              <Text className="text-sm font-bold text-[#1A1A2E]">My Listings</Text>
            </View>
            <View className="bg-[#F4EFE8] px-2.5 py-1 rounded-full">
              <Text className="text-xs text-[#9CA3AF] font-semibold">
                {myListings.length} active
              </Text>
            </View>
          </View>

          <View>
            {myListings.map((listing, idx) => (
              <View
                key={listing.id}
                className={`flex-row items-center gap-3 p-3 bg-[#F9F6F1] rounded-lg border border-[#E8E2D9] ${
                  idx !== myListings.length - 1 ? 'mb-2' : ''
                }`}
              >
                <Image
                  source={{ uri: listing.image }}
                  className="w-11 h-11 rounded-lg bg-[#E8E2D9]"
                />
                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold text-[#1A1A2E]"
                    numberOfLines={1}
                  >
                    {listing.title}
                  </Text>
                  <Text className="text-sm font-bold text-[#1B3A6B] mt-0.5">
                    {listing.price}
                  </Text>
                </View>
                <View className="bg-green-100 px-2 py-0.5 rounded-full">
                  <Text className="text-xs font-semibold text-green-700">
                    Active
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <View className="absolute inset-0 bg-black/40 items-end justify-end">
          <View className="w-full bg-white rounded-t-3xl p-6 pb-8">
            {/* Handle */}
            <View className="w-10 h-1 bg-[#E8E2D9] rounded-full mx-auto mb-6" />

            {/* Content */}
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                <LogOut size={28} color="#EF4444" strokeWidth={1.8} />
              </View>
              <Text className="text-lg font-bold text-[#1A1A2E] mb-2">
                Sign Out?
              </Text>
              <Text className="text-sm text-[#6B7280] text-center">
                You'll need to sign in again to access Ahli Connect.
              </Text>
            </View>

            {/* Buttons */}
            <View className="gap-3">
              <TouchableOpacity
                onPress={handleLogout}
                className="w-full bg-[#1B3A6B] items-center py-3.5 rounded-lg"
              >
                <Text className="text-sm font-semibold text-white">
                  Yes, Sign Out
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowLogoutConfirm(false)}
                className="w-full bg-white border border-[#E8E2D9] items-center py-3.5 rounded-lg"
              >
                <Text className="text-sm font-semibold text-[#6B7280]">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
