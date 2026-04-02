'use client';
import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { COLLEAGUES } from '@/lib/mockData';
import Avatar from '@/components/ui/Avatar';
import { Send, Search, Phone, Video, MoreHorizontal, ArrowLeft } from 'lucide-react';

const MOCK_MESSAGES = [
  { id: 1, from: 'other', text: "Hi! Did you review the Q3 announcement?", time: '10:12' },
  { id: 2, from: 'me', text: "Yes, great results this quarter!", time: '10:14' },
  { id: 3, from: 'other', text: "Absolutely. The sustainability summit next month should be exciting.", time: '10:15' },
  { id: 4, from: 'me', text: "Are you registering for it?", time: '10:16' },
  { id: 5, from: 'other', text: "Definitely! Let's sit together.", time: '10:17' },
];

export default function ChatPage() {
  const [activeColleague, setActiveColleague] = useState(COLLEAGUES[0]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [search, setSearch] = useState('');
  const [showChat, setShowChat] = useState(false); // mobile: toggle between list and chat

  const filtered = COLLEAGUES.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase())
  );

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { id: Date.now(), from: 'me', text: input, time: new Date().toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, { id: Date.now() + 1, from: 'other', text: "Thanks for the message! I'll get back to you shortly.", time: new Date().toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1200);
  };

  const selectColleague = (col: typeof COLLEAGUES[0]) => {
    setActiveColleague(col);
    setShowChat(true);
  };

  return (
    <AppShell title="Chat" subtitle="Connect with colleagues across IHC">
      <div className="flex flex-col gap-4 h-[calc(100vh-8rem)]">

        {/* Contact list - visible on desktop always, on mobile only when chat not shown */}
        <div className={`${showChat ? 'hidden' : 'flex'} w-full bg-white rounded-[20px] border border-[#E8E2D9] flex-col overflow-hidden`}>
          <div className="p-4 border-b border-[#F4EFE8]">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search colleagues..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#F9F6F1] border border-[#E8E2D9] rounded-[10px] pl-8 pr-3 py-2 text-xs outline-none focus:border-[#1B3A6B]"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(col => (
              <button
                key={col.id}
                onClick={() => selectColleague(col)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F9F6F1] transition-colors text-left ${activeColleague.id === col.id ? 'bg-[#F4EFE8]' : ''}`}
              >
                <Avatar initials={col.avatar} color="#6B7280" size="md" online={col.online} image={col.image} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1A1A2E] truncate">{col.name}</p>
                  <p className="text-xs text-[#9CA3AF] truncate">{col.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area - visible on desktop always, on mobile only when chat shown */}
        <div className={`${showChat ? 'flex' : 'hidden'} flex-1 bg-white rounded-[20px] border border-[#E8E2D9] flex-col overflow-hidden`}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#F4EFE8]">
            {/* Back button - mobile only */}
            <button
              onClick={() => setShowChat(false)}
              className="p-1.5 -ml-1 rounded-lg text-[#6B7280] hover:bg-[#F4EFE8] transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <Avatar initials={activeColleague.avatar} color="#6B7280" size="md" online={activeColleague.online} image={activeColleague.image} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1A1A2E] truncate">{activeColleague.name}</p>
              <p className="text-xs text-[#9CA3AF] truncate">{activeColleague.title} · {activeColleague.company}</p>
            </div>
            <div className="hidden gap-1">
              {[Phone, Video, MoreHorizontal].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[#9CA3AF] hover:bg-[#F4EFE8] transition-colors">
                  <Icon size={16} strokeWidth={1.8} />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'} gap-2`}>
                {msg.from === 'other' && <Avatar initials={activeColleague.avatar} color="#6B7280" size="sm" image={activeColleague.image} />}
                <div>
                  <div className={`px-3.5 py-2.5 rounded-[14px] text-sm max-w-xs leading-relaxed ${
                    msg.from === 'me'
                      ? 'bg-[#1B3A6B] text-white rounded-br-sm'
                      : 'bg-[#F4EFE8] text-[#1A1A2E] rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-[#9CA3AF] mt-1 ${msg.from === 'me' ? 'text-right' : ''}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-[#F4EFE8] flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={`Message ${activeColleague.name.split(' ')[0]}...`}
              className="flex-1 bg-[#F9F6F1] border border-[#E8E2D9] rounded-[12px] px-3 py-2.5 text-sm outline-none focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10"
            />
            <button
              onClick={send}
              className="w-10 h-10 bg-[#1B3A6B] text-white rounded-[12px] flex items-center justify-center hover:bg-[#152E56] transition-colors shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
