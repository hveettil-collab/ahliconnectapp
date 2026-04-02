import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
// Using a View with background color instead of LinearGradient to avoid extra dependency

const DEMO_ACCOUNTS = [
  { label: 'Sara Ahmed / Shory', email: 'sara@example.com', password: 'demo123' },
  { label: 'Khalid / Aldar', email: 'khalid@example.com', password: 'demo123' },
  { label: 'Noura / PureHealth', email: 'noura@example.com', password: 'demo123' },
];

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email);
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsLoading(true);
    try {
      await login(demoEmail);
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      Alert.alert('Login Failed', 'Demo account login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: '#F4EFE8' }}
      >
        <View className="flex-1 px-6 py-8 justify-between">
          {/* Logo Section */}
          <View className="items-center pt-8">
            <Text className="text-3xl font-bold text-navy-dark" style={{ color: '#1B3A6B' }}>
              Ahli Connect
            </Text>
            <Text className="text-sm text-gray-600 mt-1">by IHC Group</Text>
          </View>

          {/* Form Section */}
          <View className="space-y-6">
            {/* Email Input */}
            <View>
              <Text className="text-sm font-semibold text-gray-800 mb-2">Email</Text>
              <TextInput
                className="px-4 py-3 rounded-lg border-2"
                style={{
                  borderColor: email ? '#1B3A6B' : '#E8E2D9',
                  backgroundColor: '#FFFFFF',
                  color: '#1B3A6B',
                }}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-sm font-semibold text-gray-800 mb-2">Password</Text>
              <TextInput
                className="px-4 py-3 rounded-lg border-2"
                style={{
                  borderColor: password ? '#1B3A6B' : '#E8E2D9',
                  backgroundColor: '#FFFFFF',
                  color: '#1B3A6B',
                }}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
                secureTextEntry
              />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className="mt-4 py-3 px-6 rounded-lg items-center justify-center"
              style={{ backgroundColor: '#1B3A6B' }}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-semibold text-lg">Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Demo Accounts Section */}
          <View className="space-y-3">
            <Text className="text-xs text-gray-600 text-center mb-2">Quick Select Demo Accounts</Text>
            {DEMO_ACCOUNTS.map((account, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleDemoLogin(account.email, account.password)}
                disabled={isLoading}
                className="py-2 px-4 rounded-lg border-2"
                style={{ borderColor: '#E8E2D9', backgroundColor: '#FFFFFF' }}
              >
                <Text className="text-sm text-center font-medium" style={{ color: '#1B3A6B' }}>
                  {account.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
