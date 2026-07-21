import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot, Send, User, Globe, Clock,
  MessageSquare, CheckCircle, Star, Calendar, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatMessage {
  id: string;
  role: 'user' | 'concierge';
  content: string;
  timestamp: string;
  language?: string;
}

const DEMO_CONVERSATION: ChatMessage[] = [
  { id: '1', role: 'concierge', content: 'Hello! I\'m Axis, the OneAxis concierge. I can help you explore Harbour Residences, check availability, arrange a viewing, or answer any questions. What would you like to know?', timestamp: '9:00 AM', language: 'EN' },
  { id: '2', role: 'user', content: 'Hi, I\'m looking for a 3-bedroom apartment with water views', timestamp: '9:01 AM' },
  { id: '3', role: 'concierge', content: 'Great choice! We have 12 three-bedroom apartments with harbour views available. The most popular is Unit 2401 — 145m², north-east facing, panoramic water views from the living room and master bedroom. Price: $2.85M. Would you like to see the view simulation or compare options?', timestamp: '9:01 AM' },
  { id: '4', role: 'user', content: 'Can I book a private viewing for Saturday?', timestamp: '9:03 AM' },
  { id: '5', role: 'concierge', content: 'I\'d be happy to arrange that. We have slots available this Saturday at 10:00 AM, 11:30 AM, and 2:00 PM. Each viewing includes a guided tour of the display suite, the view simulation for your shortlisted units, and a consultation with our sales director. Which time works best for you?', timestamp: '9:03 AM' },
];

const STATS = {
  conversations: 2847,
  qualified: 892,
  bookings: 234,
  satisfaction: 94.2,
  avgResponse: '2.4s',
  languages: 8,
};

const LANGUAGES = [
  { code: 'EN', name: 'English', active: true },
  { code: 'ZH', name: '中文', active: true },
  { code: 'AR', name: 'العربية', active: true },
  { code: 'HI', name: 'हिंदी', active: false },
  { code: 'VI', name: 'Tiếng Việt', active: false },
];

export default function AxisConcierge() {
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_CONVERSATION);
  const [input, setInput] = useState('');
  const [activeLang, setActiveLang] = useState('EN');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const conciergeMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'concierge',
        content: 'Thank you for your interest! I\'ve noted your request and will connect you with our sales team. In the meantime, would you like me to send you the digital brochure for Harbour Residences, or help you explore our interactive 3D model?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, conciergeMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-full flex">
      {/* Chat Panel */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 glass-panel border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm">Axis Concierge</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400">Online — 24/7</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {LANGUAGES.filter(l => l.active).map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setActiveLang(lang.code)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                    activeLang === lang.code ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {lang.code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'concierge' ? 'bg-blue-500/20' : 'bg-gray-700'
              }`}>
                {msg.role === 'concierge' ? <Bot className="w-3.5 h-3.5 text-blue-400" /> : <User className="w-3.5 h-3.5 text-gray-400" />}
              </div>
              <div className={`max-w-[70%] rounded-xl px-3 py-2 ${
                msg.role === 'concierge'
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-blue-600'
              }`}>
                <p className={`text-xs leading-relaxed ${msg.role === 'concierge' ? 'text-gray-300' : 'text-white'}`}>
                  {msg.content}
                </p>
                <span className={`text-[9px] mt-1 block ${msg.role === 'concierge' ? 'text-gray-600' : 'text-blue-200'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Axis anything about the project..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
            />
            <Button className="bg-blue-600 hover:bg-blue-500" onClick={handleSend}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600">
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" />Powered by GPT-4o + project data</span>
            <span>•</span>
            <span>Honest about being AI</span>
          </div>
        </div>
      </div>

      {/* Stats Sidebar */}
      <div className="w-64 glass-panel border-l border-gray-700 p-4 overflow-y-auto">
        <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Performance</h4>
        <div className="space-y-3">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] text-gray-400">Conversations</span>
            </div>
            <div className="text-lg font-bold text-white">{STATS.conversations.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] text-gray-400">Qualified Leads</span>
            </div>
            <div className="text-lg font-bold text-emerald-400">{STATS.qualified.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[10px] text-gray-400">Viewings Booked</span>
            </div>
            <div className="text-lg font-bold text-purple-400">{STATS.bookings}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] text-gray-400">Satisfaction</span>
            </div>
            <div className="text-lg font-bold text-amber-400">{STATS.satisfaction}%</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] text-gray-400">Avg Response</span>
            </div>
            <div className="text-lg font-bold text-cyan-400">{STATS.avgResponse}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-[10px] text-gray-400">Languages</span>
            </div>
            <div className="text-lg font-bold text-pink-400">{STATS.languages}</div>
          </div>
        </div>

        <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2 mt-4">Active Languages</h4>
        <div className="space-y-1">
          {LANGUAGES.map(lang => (
            <div key={lang.code} className="flex items-center justify-between text-xs">
              <span className="text-gray-400">{lang.name}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${lang.active ? 'bg-emerald-400' : 'bg-gray-600'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
