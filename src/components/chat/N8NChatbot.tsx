import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Trash2, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  MapPin,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { ChatMessage, n8nChatService } from '../../services/n8nChatService';

interface N8NChatbotProps {
  onApplyAddressToForm?: (addressText: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const N8NChatbot: React.FC<N8NChatbotProps> = ({
  onApplyAddressToForm,
  isOpen,
  onToggle
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "👋 **Welcome to PostalAI Assistant!**\n\nI am connected to your **n8n AI Agent Workflow** (`roja0902.app.n8n.cloud`). Ask me about any Indian address, check for PIN code mismatches, or find the correct delivery post office.",
      timestamp: new Date().toISOString(),
      source: 'n8n_cloud'
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const webhookUrl = n8nChatService.getWebhookUrl();

  const quickPrompts = [
    { label: 'MVP Colony PIN', query: 'What is the correct PIN code for MVP Colony in Visakhapatnam?' },
    { label: 'Why 530018 is Mismatch', query: 'Why is PIN 530018 considered a mismatch for MVP Colony?' },
    { label: 'Indiranagar Post Office', query: 'Which delivery post office serves Indiranagar, Bengaluru PIN 560038?' },
    { label: 'Verify Sample Address', query: 'Verify address: Flat 3B, Golden Palms, Sector 6, MVP Colony, Visakhapatnam 530017' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const botReply = await n8nChatService.sendMessage(text.trim());
      setMessages((prev) => [...prev, botReply]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          text: `⚠️ **Error connecting to n8n webhook:** ${err?.message || 'Network timeout'}`,
          timestamp: new Date().toISOString(),
          source: 'local_agent_fallback'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    n8nChatService.clearSession();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: "Chat cleared. Session reset. How can I assist with your postal verification today?",
        timestamp: new Date().toISOString(),
        source: 'n8n_cloud'
      }
    ]);
  };

  // Simple Markdown text renderer with bold and line break support
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, lIdx) => {
      // Bold tags **text**
      const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);

      return (
        <span key={lIdx} className="block leading-relaxed">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
              return (
                <code key={pIdx} className="px-1.5 py-0.5 rounded bg-blue-100/70 text-blue-900 font-mono text-xs font-semibold">
                  {part.slice(1, -1)}
                </code>
              );
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group border border-blue-700/60"
          aria-label="Open n8n Postal AI Chatbot"
        >
          <div className="relative">
            <Bot size={20} className="text-cyan-300 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-900 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-tight">PostalAI Assistant</div>
            <div className="text-[10px] text-cyan-300 font-mono">n8n Agent Online</div>
          </div>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 shadow-2xl rounded-2xl bg-white border border-slate-200 flex flex-col overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] h-[580px] max-h-[88vh]'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white flex items-center justify-between border-b border-blue-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
                <Bot size={18} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white">PostalAI Assistant</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-200 border border-cyan-400/30">
                    n8n Cloud
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span className="truncate max-w-[200px]" title={webhookUrl}>
                    roja0902.app.n8n.cloud
                  </span>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1 text-slate-300">
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-md hover:bg-blue-800/80 hover:text-white transition-colors cursor-pointer"
                title="Clear chat history"
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-md hover:bg-blue-800/80 hover:text-white transition-colors cursor-pointer"
                title={isExpanded ? 'Restore window size' : 'Expand window'}
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
              <button
                onClick={onToggle}
                className="p-1.5 rounded-md hover:bg-rose-900/80 hover:text-rose-200 transition-colors cursor-pointer"
                title="Close chat"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Webhook Status Info Ribbon */}
          <div className="bg-blue-50/80 border-b border-blue-200/70 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-blue-900">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-600" />
              Webhook Active: <code className="font-mono text-[10px] text-blue-950">/webhook/.../chat</code>
            </span>
            <a
              href="https://roja0902.app.n8n.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-950 font-semibold flex items-center gap-0.5"
            >
              <span>Canvas</span>
              <ExternalLink size={10} />
            </a>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-xs ${
                      isUser
                        ? 'bg-blue-900 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                    }`}
                  >
                    {renderFormattedText(msg.text)}

                    {/* Source attribution tag */}
                    {!isUser && msg.source && (
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>
                          {msg.source === 'n8n_cloud' ? '⚡ n8n AI Agent' : '🔍 PostalAI Fallback'}
                        </span>
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Loader */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs bg-white border border-slate-200 p-2.5 rounded-xl w-32 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                <span className="text-[11px] font-medium text-slate-600">n8n thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[10px] font-bold text-slate-600 uppercase shrink-0 flex items-center gap-1">
              <Sparkles size={11} className="text-cyan-600" />
              Try:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-[11px] text-slate-700 whitespace-nowrap transition-colors cursor-pointer font-medium shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask n8n agent about an address or PIN..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-sans"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white transition-colors cursor-pointer shadow-xs"
              title="Send message"
            >
              <Send size={15} className="text-cyan-300" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
