import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import {
  Send,
  Zap,
  FileText,
  Receipt,
  Calendar,
  TrendingUp,
  DollarSign,
} from 'lucide-react-native';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  cards?: ActionCard[];
  typing?: boolean;
}

interface ActionCard {
  type: 'action' | 'info';
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color: string;
  link?: string;
}

const SUGGESTIONS = [
  {
    icon: Zap,
    label: 'Automations',
    prompt: 'Show me available automations',
    color: '#059669',
  },
  {
    icon: FileText,
    label: 'Salary Certificate',
    prompt: 'I need a salary certificate for a bank loan',
    color: '#1B3A6B',
  },
  {
    icon: Receipt,
    label: 'Expense Claim',
    prompt: 'I need to submit an expense receipt',
    color: '#C8973A',
  },
  {
    icon: Calendar,
    label: 'Leave Request',
    prompt: 'I want to apply for annual leave',
    color: '#0D9488',
  },
];

function generateAIResponse(
  text: string,
  userName: string,
): { content: string; cards?: ActionCard[] } {
  const t = text.toLowerCase();

  if (
    t.includes('salary') ||
    t.includes('payslip') ||
    t.includes('certificate') ||
    t.includes('pay')
  ) {
    return {
      content: `Salary options:\n\nMarch payslip ready to download\nSalary certificates - now instant with automation!\nNext salary credit: April 28th\n\nNo more waiting 3-5 days! Generate your salary certificate in under 30 seconds.`,
      cards: [
        {
          type: 'action',
          icon: Zap,
          title: 'Generate Salary Certificate',
          subtitle: 'Automated - ready in < 30 seconds',
          color: '#059669',
          link: '/automations',
        },
        {
          type: 'info',
          icon: DollarSign,
          title: 'View Payslip',
          subtitle: 'March 2026',
          color: '#059669',
        },
        {
          type: 'action',
          icon: TrendingUp,
          title: 'View All Automations',
          subtitle: '347 hrs/week saved across IHC',
          color: '#C8973A',
          link: '/automations',
        },
      ],
    };
  }

  if (
    t.includes('leave') ||
    t.includes('vacation day') ||
    t.includes('days off') ||
    t.includes('annual leave') ||
    t.includes('sick leave') ||
    t.includes('time off')
  ) {
    return {
      content: `Your leave summary:\n\nAnnual Leave: 22 days remaining\nSick Leave: 10 days available\nEmergency Leave: 5 days/incident\n\nYou can now submit leave requests instantly using Smart Leave Manager automation!`,
      cards: [
        {
          type: 'action',
          icon: Zap,
          title: 'Submit Leave Request',
          subtitle: 'Automated - instant approval pipeline',
          color: '#059669',
          link: '/automations',
        },
        {
          type: 'info',
          icon: Calendar,
          title: 'Leave Balance',
          subtitle: '22 annual - 10 sick - 5 emergency',
          color: '#1B3A6B',
        },
        {
          type: 'action',
          icon: TrendingUp,
          title: 'View All Automations',
          subtitle: '347 hrs/week saved across IHC',
          color: '#C8973A',
          link: '/automations',
        },
      ],
    };
  }

  if (
    t.includes('expense') ||
    t.includes('receipt') ||
    t.includes('reimburse') ||
    t.includes('claim') ||
    t.includes('reimbursement')
  ) {
    return {
      content: `Expense management:\n\nAI Expense Processor - snap a receipt, AI does the rest!\nPending claims: 0\nLast reimbursement: AED 420 (31 Mar)\n\nNo more manual Excel entry. Our AI extracts vendor, amount, date & category automatically.`,
      cards: [
        {
          type: 'action',
          icon: Zap,
          title: 'Submit Expense Claim',
          subtitle: 'AI-powered - receipt to reimbursement in 2 min',
          color: '#059669',
          link: '/automations',
        },
        {
          type: 'info',
          icon: Receipt,
          title: 'Expense History',
          subtitle: '3 claims this month - AED 1,142',
          color: '#1B3A6B',
        },
        {
          type: 'action',
          icon: TrendingUp,
          title: 'View All Automations',
          subtitle: '347 hrs/week saved across IHC',
          color: '#C8973A',
          link: '/automations',
        },
      ],
    };
  }

  if (
    t.includes('automat') ||
    t.includes('workflow') ||
    t.includes('process')
  ) {
    return {
      content: `Here are the automations available to you:\n\nSalary Certificate - Instant PDF with digital verification\nSmart Leave Manager - Auto-balance, conflict check, approval pipeline\nAI Expense Processor - Receipt scanning with policy compliance\n\nTogether these save 347 hours/week across IHC with a 95% error reduction.`,
      cards: [
        {
          type: 'action',
          icon: FileText,
          title: 'Salary Certificate',
          subtitle: 'Generate in < 30 seconds',
          color: '#1B3A6B',
          link: '/automations',
        },
        {
          type: 'action',
          icon: Calendar,
          title: 'Leave Request',
          subtitle: 'Automated approval pipeline',
          color: '#0D9488',
          link: '/automations',
        },
        {
          type: 'action',
          icon: Receipt,
          title: 'Expense Claim',
          subtitle: 'AI receipt extraction',
          color: '#C8973A',
          link: '/automations',
        },
      ],
    };
  }

  return {
    content: `Hi ${userName}! I'm your AI assistant for everything at IHC. I can help with:\n\nSalary certificates and payslips\nLeave requests and time off\nExpense claims and reimbursements\nAutomations and workflows\n\nJust ask me anything!`,
    cards: [
      {
        type: 'action',
        icon: FileText,
        title: 'Salary Certificate',
        subtitle: 'Generate instantly',
        color: '#1B3A6B',
        link: '/automations',
      },
      {
        type: 'action',
        icon: Calendar,
        title: 'Leave Request',
        subtitle: 'Automated approval',
        color: '#0D9488',
        link: '/automations',
      },
      {
        type: 'action',
        icon: Receipt,
        title: 'Expense Claim',
        subtitle: 'AI-powered',
        color: '#C8973A',
        link: '/automations',
      },
      {
        type: 'action',
        icon: TrendingUp,
        title: 'All Automations',
        subtitle: 'View all available',
        color: '#059669',
        link: '/automations',
      },
    ],
  };
}

export default function ServicesScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      content: `Hi ${user?.name || 'there'}! I'm your AI assistant. How can I help you today?`,
      cards: [
        {
          type: 'action',
          icon: FileText,
          title: 'Salary Certificate',
          subtitle: 'Generate instantly',
          color: '#1B3A6B',
          link: '/automations',
        },
        {
          type: 'action',
          icon: Calendar,
          title: 'Leave Request',
          subtitle: 'Automated approval',
          color: '#0D9488',
          link: '/automations',
        },
        {
          type: 'action',
          icon: Receipt,
          title: 'Expense Claim',
          subtitle: 'AI-powered',
          color: '#C8973A',
          link: '/automations',
        },
        {
          type: 'action',
          icon: TrendingUp,
          title: 'All Automations',
          subtitle: 'View all available',
          color: '#059669',
          link: '/automations',
        },
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const response = generateAIResponse(inputValue, user?.name || 'User');
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.content,
        cards: response.cards,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);

      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 500);
  };

  const handleSuggestion = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleCardAction = (link?: string) => {
    if (link) {
      router.push(link as any);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={100}
      >
        <View className="flex-1 bg-white">
          {/* Header */}
          <View
            className="px-5 py-4"
            style={{ backgroundColor: '#1B3A6B' }}
          >
            <Text className="text-white text-lg font-bold">AI Assistant</Text>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 py-4"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((msg) => (
              <View key={msg.id} className={`mb-4 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Message bubble */}
                <View
                  className={`max-w-xs px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-[#1B3A6B]'
                      : 'bg-[#F4EFE8] border border-[#E8E2D9]'
                  }`}
                >
                  <Text
                    className={`text-sm leading-5 ${
                      msg.role === 'user' ? 'text-white' : 'text-[#1A1A2E]'
                    }`}
                  >
                    {msg.content}
                  </Text>
                </View>

                {/* Action cards */}
                {msg.cards && msg.cards.length > 0 && (
                  <View className="mt-3 w-full">
                    {msg.cards.map((card, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => handleCardAction(card.link)}
                        className="mb-2 p-3 bg-white border border-[#E8E2D9] rounded-lg"
                      >
                        <View className="flex-row items-start gap-3">
                          <View
                            className="w-10 h-10 rounded-lg items-center justify-center"
                            style={{ backgroundColor: `${card.color}20` }}
                          >
                            <card.icon size={20} color={card.color} strokeWidth={2} />
                          </View>
                          <View className="flex-1">
                            <Text
                              className="text-sm font-semibold text-[#1A1A2E]"
                              numberOfLines={1}
                            >
                              {card.title}
                            </Text>
                            <Text
                              className="text-xs text-[#6B7280] mt-0.5"
                              numberOfLines={1}
                            >
                              {card.subtitle}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}

            {isLoading && (
              <View className="mb-4 items-start">
                <View className="bg-[#F4EFE8] border border-[#E8E2D9] px-4 py-3 rounded-2xl">
                  <Text className="text-[#1A1A2E] text-sm">Thinking...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Suggestion chips */}
          {messages.length === 1 && (
            <View className="px-4 py-3 border-t border-[#E8E2D9]">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row gap-2"
              >
                {SUGGESTIONS.map((s, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleSuggestion(s.prompt)}
                    className="px-4 py-2 rounded-full border border-[#E8E2D9] flex-row items-center gap-2"
                  >
                    <s.icon size={16} color={s.color} strokeWidth={2} />
                    <Text className="text-xs font-medium text-[#1A1A2E]">
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Input */}
          <View className="px-4 py-3 bg-white border-t border-[#E8E2D9]">
            <View className="flex-row items-center gap-3">
              <TextInput
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Ask me anything..."
                placeholderTextColor="#9CA3AF"
                className="flex-1 px-4 py-3 bg-[#F4EFE8] rounded-full text-[#1A1A2E]"
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  inputValue.trim() && !isLoading
                    ? 'bg-[#1B3A6B]'
                    : 'bg-[#E8E2D9]'
                }`}
              >
                <Send
                  size={18}
                  color={inputValue.trim() && !isLoading ? '#FFFFFF' : '#9CA3AF'}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
