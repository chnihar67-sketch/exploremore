import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Compass, MapPin, Loader2, Bot, User, CornerDownLeft } from 'lucide-react';

interface LocaloraAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreDestination?: (destName: string) => void;
}

interface Message {
  role: 'assistant' | 'user';
  content: string;
  suggestedDestinations?: string[];
  budgetEstimate?: string;
}

export const LocaloraAssistantModal: React.FC<LocaloraAssistantModalProps> = ({
  isOpen,
  onClose,
  onExploreDestination,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Namaskara! I am your Localora trip concierge across Karnataka. Ask me about unexplored heritage spots, plantation and coastal homestays, trekking permits, authentic regional cuisines (Malnad Akki Rotti, Karavali Neer Dosa, North Karnataka Jolada Rotti), or planning a customized itinerary for any budget.',
      suggestedDestinations: ['Hampi UNESCO', 'Gokarna Om Beach', 'Jog Falls', 'Coorg Hills', 'Badami Caves'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickPrompts = [
    'I have ₹6,000 and 3 days. Suggest a trip across Karnataka.',
    'What are the best heritage walks in Hampi and Badami caves?',
    'Recommend authentic coastal homestays and cliff treks in Gokarna.',
    'Plan a 2-day monsoon trip to Jog Falls and Agumbe rainforest.',
  ];

  const handleSend = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userText.trim() },
    ];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText.trim(),
          history: messages.slice(-6),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reach assistant server');
      }

      const data = await response.json();
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: data.reply || 'Here is what I found for you.',
          suggestedDestinations: data.suggestedDestinations,
          budgetEstimate: data.budgetEstimate,
        },
      ]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content:
            'I experienced a connection hiccup with the local intelligence server. Here is our direct recommendation:\n\n- **Day 1**: Arrive in Shivamogga, visit Sakrebailu Elephant camp, proceed to Tirthahalli for Kavaledurga Fort hike.\n- **Day 2**: Agumbe rainforest trails and Sunset Point, then homestay dinner.\n- **Budget**: Approx ₹2,500/person including homestay and local transport.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#faf7f2] w-full max-w-2xl h-[85vh] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#14281f] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2d5a43] flex items-center justify-center text-[#52b788]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base">Localora Trip Concierge</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#52b788]/20 text-[#52b788] rounded-md font-medium">
                  Verified Local Knowledge
                </span>
              </div>
              <div className="text-[11px] text-stone-300">
                Shivamogga &amp; Malnad Regional Travel Advisory
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2.5 bg-[#eef5f0] border-b border-stone-200 overflow-x-auto flex items-center gap-2 text-xs shrink-0">
          <span className="text-[11px] font-semibold text-[#1b4332] whitespace-nowrap">Try asking:</span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-[11px] text-stone-700 whitespace-nowrap transition-colors text-left"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                  msg.role === 'user'
                    ? 'bg-[#2d5a43] text-white'
                    : 'bg-[#14281f] text-[#52b788]'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#2d5a43] text-white rounded-tr-xs'
                    : 'bg-white border border-stone-200 text-stone-800 rounded-tl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line prose-sm">
                  {msg.content}
                </div>

                {msg.suggestedDestinations && msg.suggestedDestinations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-stone-400 text-[11px]">Recommended:</span>
                    {msg.suggestedDestinations.map((dest, dIdx) => (
                      <button
                        key={dIdx}
                        onClick={() => {
                          if (onExploreDestination) onExploreDestination(dest);
                          onClose();
                        }}
                        className="px-2 py-0.5 bg-[#eef5f0] text-[#1b4332] rounded text-[11px] font-medium hover:bg-[#d8e8dc]"
                      >
                        {dest} &rarr;
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#14281f] text-[#52b788] flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl p-4 text-xs text-stone-500 flex items-center gap-2 shadow-xs">
                <Sparkles className="w-4 h-4 text-[#2d5a43] animate-pulse" />
                <span>Consulting Western Ghats local records &amp; itineraries...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-stone-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about trips, hidden waterfalls, Malnad food or budget..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a43]/30 focus:border-[#2d5a43]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-40 flex items-center gap-1.5"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="mt-1.5 text-[10px] text-stone-400 text-center">
            Localora AI advises on genuine regional logistics, seasonal monsoon timings, and authentic prices.
          </div>
        </div>
      </div>
    </div>
  );
};
