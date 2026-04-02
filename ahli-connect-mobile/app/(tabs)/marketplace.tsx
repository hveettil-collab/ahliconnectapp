import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { MARKETPLACE_LISTINGS, COMPANIES } from '@/lib/mockData';
import { Search, X } from 'lucide-react-native';

const CATEGORIES = ['All', 'Cars', 'Property', 'Electronics', 'Furniture'];

interface Listing {
  id: string;
  title: string;
  category: string;
  price: string;
  seller: string;
  sellerCompany: string;
  condition: string;
  posted: string;
  featured: boolean;
  description: string;
  image: string;
  specs: Record<string, string>;
}

export default function MarketplaceScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredListings = useMemo(() => {
    let filtered = MARKETPLACE_LISTINGS as unknown as Listing[];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((l) => l.category === selectedCategory);
    }

    // Filter by search text
    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query) ||
          l.seller.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [searchText, selectedCategory]);

  const featuredListings = filteredListings.filter((l) => l.featured);
  const otherListings = filteredListings.filter((l) => !l.featured);

  const handleListingPress = (listing: Listing) => {
    Alert.alert(
      listing.title,
      `${listing.price}\n\n${listing.description}\n\nSeller: ${listing.seller}\nCondition: ${listing.condition}\nPosted: ${listing.posted}`,
      [
        {
          text: 'Contact Seller',
          onPress: () => Alert.alert('Message sent to ' + listing.seller),
        },
        { text: 'Close', style: 'cancel' },
      ],
    );
  };

  const FeaturedCard = ({ listing }: { listing: Listing }) => (
    <TouchableOpacity
      onPress={() => handleListingPress(listing)}
      className="mb-4 bg-white rounded-xl overflow-hidden border border-[#E8E2D9] shadow-sm"
    >
      <View className="relative">
        <Image
          source={{ uri: listing.image }}
          className="w-full h-40 bg-[#F4EFE8]"
        />
        <View className="absolute top-3 right-3 bg-[#C8973A] px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">Featured</Text>
        </View>
      </View>

      <View className="p-3">
        <Text className="text-sm font-bold text-[#1A1A2E]" numberOfLines={2}>
          {listing.title}
        </Text>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-lg font-bold text-[#1B3A6B]">
            {listing.price}
          </Text>
          <View className="bg-[#D1FAE5] px-2 py-1 rounded-full">
            <Text className="text-xs font-semibold text-[#065F46]">
              {listing.condition}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2 mt-2">
          <Image
            source={{
              uri: COMPANIES.find((c) => c.id === 'ihc')?.logo || '',
            }}
            className="w-4 h-4"
          />
          <Text className="text-xs text-[#6B7280]">{listing.seller}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const GridCard = ({ listing }: { listing: Listing }) => (
    <TouchableOpacity
      onPress={() => handleListingPress(listing)}
      className="flex-1 m-2 bg-white rounded-lg overflow-hidden border border-[#E8E2D9] shadow-sm"
    >
      <Image
        source={{ uri: listing.image }}
        className="w-full h-24 bg-[#F4EFE8]"
      />
      <View className="p-2">
        <Text className="text-xs font-semibold text-[#1A1A2E]" numberOfLines={1}>
          {listing.title}
        </Text>
        <Text className="text-sm font-bold text-[#1B3A6B] mt-1">
          {listing.price}
        </Text>
        <Text className="text-xs text-[#6B7280] mt-0.5">{listing.condition}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-xl font-bold text-[#1A1A2E] mb-3">
            Marketplace
          </Text>

          {/* Search Bar */}
          <View className="flex-row items-center bg-[#F4EFE8] rounded-full px-3 py-2 gap-2">
            <Search size={18} color="#9CA3AF" strokeWidth={2} />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search listings..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-[#1A1A2E] text-sm"
            />
            {searchText ? (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <X size={16} color="#9CA3AF" strokeWidth={2} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-3"
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              className={`mr-2 px-4 py-2 rounded-full border ${
                selectedCategory === cat
                  ? 'bg-[#1B3A6B] border-[#1B3A6B]'
                  : 'border-[#E8E2D9] bg-white'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  selectedCategory === cat
                    ? 'text-white'
                    : 'text-[#6B7280]'
                }`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Counter */}
        {filteredListings.length > 0 && (
          <View className="px-4 py-2">
            <Text className="text-xs text-[#6B7280]">
              {filteredListings.length} item{filteredListings.length !== 1 ? 's' : ''} found
            </Text>
          </View>
        )}

        {/* Content */}
        {filteredListings.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-[#6B7280] text-sm">No listings found</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Featured Section */}
            {featuredListings.length > 0 && (
              <View className="px-4 py-3">
                <Text className="text-sm font-bold text-[#1A1A2E] mb-2">
                  Featured
                </Text>
                {featuredListings.map((listing) => (
                  <FeaturedCard key={listing.id} listing={listing} />
                ))}
              </View>
            )}

            {/* All Listings Grid */}
            {otherListings.length > 0 && (
              <View className="px-2 pb-4">
                <Text className="text-sm font-bold text-[#1A1A2E] ml-2 mb-2">
                  All Listings
                </Text>
                <View className="flex-row flex-wrap">
                  {otherListings.map((listing) => (
                    <GridCard key={listing.id} listing={listing} />
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
