import { Tabs } from 'expo-router';
import { Home, Compass, Sparkles, ShoppingBag, User } from 'lucide-react-native';
import { View, Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#1B3A6B',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: focused ? '#F4EFE8' : 'transparent',
              }}
            >
              <Home size={24} color={color} strokeWidth={2} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: focused ? '#F4EFE8' : 'transparent',
              }}
            >
              <Compass size={24} color={color} strokeWidth={2} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#1B3A6B',
                marginTop: -8,
                shadowColor: '#1B3A6B',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Sparkles size={28} color="#FFFFFF" strokeWidth={2} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Market',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: focused ? '#F4EFE8' : 'transparent',
              }}
            >
              <ShoppingBag size={24} color={color} strokeWidth={2} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: focused ? '#F4EFE8' : 'transparent',
              }}
            >
              <User size={24} color={color} strokeWidth={2} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
