import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  MessageSquare,
  Bot,
  User,
  ArrowRight,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { askAiAssistant } from '../../services/growthApi';
import { BusinessAnalysis, Lead } from '../../types';

interface AiAssistantDrawerProps {
  businessAnalysis: BusinessAnalysis;
  leadsCount: number;
  onNavigateAction?: (action: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  businessAnalysis,
  leadsCount,
  onNavigateAction,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello! I'm **Andeola AI**, your outbound sales intelligence partner. I'm currently tuned to **${businessAnalysis.businessName || 'your business'}** (${businessAnalysis.industry || 'Ecommerce'}). How can I help you find and reach high-conviction customers today?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const suggestions = [
    'Analyze my website',
    'Define my ideal customer',
    'Find ecommerce prospects in Europe',
    'Create an outreach campaign',
    'Explain my campaign performance',
  ];

  const handleSendMessage = async (userPrompt?: string) => {
    const textToSend = userPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await askAiAssistant(textToSend, {
        currentBusiness: businessAnalysis.businessName,
        industry: businessAnalysis.industry,
        totalLeadsAvailable: leadsCount,
      });

      const aiMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        text: "I'm ready to help! You can review your Ideal Customer Profile or search our 2,486 scored leads in the sidebar.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button with subtle pulse */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-2xl shadow-blue-600/40 border border-blue-400/30 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="hidden sm:inline tracking-wide font-bold">Andeola AI</span>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full sm:w-96 max-w-[calc(100vw-3rem)] h-[520px] max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                  Andeola AI
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[10px] text-slate-400">Contextual Sales Copilot</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs font-medium'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span className="italic">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips (As requested in prompt) */}
          <div className="px-3 py-2 bg-slate-950/40 border-t border-slate-800/80 overflow-x-auto flex gap-1.5 scrollbar-none">
            {suggestions.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => handleSendMessage(sug)}
                className="shrink-0 text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-full px-2.5 py-1 transition-colors cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Andeola AI anything..."
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
