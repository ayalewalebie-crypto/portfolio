import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, Send, Bot, User, Loader2, Sparkles, ChevronDown } from 'lucide-react';

const SUGGESTED = [
  'What skills do you have?',
  'Tell me about your projects',
  'What is your background?',
  'How can I contact you?',
  'Are you available for hire?',
];

const TypingDots = () => (
  <div className="flex items-center gap-1 px-1 py-0.5">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
        style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
      />
    ))}
  </div>
);

// Simple markdown-lite renderer: **bold**, bullet lines, newlines
const renderMarkdown = (text) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const parts = line.split(/\*\*(.+?)\*\*/g);
    const rendered = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j} className="font-semibold text-slate-900">{part}</strong> : part
    );
    const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
    if (isBullet) {
      return (
        <div key={i} className="flex gap-1.5 mt-1">
          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
          <span>{rendered}</span>
        </div>
      );
    }
    return (
      <span key={i} className={i > 0 && line ? 'block mt-1.5' : line === '' ? 'block mt-1' : 'block'}>
        {rendered}
      </span>
    );
  });
};

const AIChatWidget = ({ externalOpen = false, onExternalOpenConsumed }) => {
  const [open, setOpen] = useState(false);

  const prevExternalOpen = useRef(false);
  useEffect(() => {
    if (externalOpen && !prevExternalOpen.current) {
      prevExternalOpen.current = true;
      setOpen(true);
      onExternalOpenConsumed?.();
    } else if (!externalOpen) {
      prevExternalOpen.current = false;
    }
  }, [externalOpen, onExternalOpenConsumed]);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi there! 👋 I'm an AI assistant for this portfolio. Ask me anything about skills, projects, experience, education, or contact info!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggested, setShowSuggested] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
    }
  }, [messages, open, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    setInput('');
    setShowSuggested(false);
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setLoading(true);

    try {
      const { data } = await axios.post('/api/public/ai-chat', {
        message: trimmed,
      });
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: "Sorry, I couldn't reach the server. Please try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Floating Trigger Button ───────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
          open
            ? 'bg-slate-800 text-white pr-3.5'
            : 'bg-gradient-to-br from-purple-700 to-purple-600 text-white hover:from-purple-600 hover:to-purple-500 hover:scale-105 active:scale-100'
        }`}
      >
        {open ? (
          <>
            <ChevronDown size={18} />
            <span className="text-sm font-semibold">Close</span>
          </>
        ) : (
          <>
            <div className="relative">
              <Sparkles size={18} className="text-amber-300" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-sm font-semibold">Ask AI</span>
          </>
        )}
      </button>

      {/* ── Chat Panel ────────────────────────────────────────────────────── */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl shadow-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 origin-bottom-right ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ height: '520px' }}
        role="dialog"
        aria-label="AI Chat Assistant"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-700 to-purple-600 text-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div>
              <p className="text-sm font-bold leading-none">Portfolio AI</p>
              <p className="text-[11px] text-purple-200 mt-0.5 leading-none">Ask me anything</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-[10px] font-semibold bg-white/15 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/15 transition-colors ml-1"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50/60">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gradient-to-br from-purple-600 to-purple-500 text-white'
                }`}
              >
                {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-sm'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-xs'
                }`}
              >
                {msg.role === 'assistant' ? renderMarkdown(msg.text) : msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-500 text-white mt-0.5">
                <Bot size={13} />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-xs">
                <TypingDots />
              </div>
            </div>
          )}

          {/* Suggested prompts */}
          {showSuggested && messages.length === 1 && (
            <div className="pt-1">
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-2">
                Suggested questions
              </p>
              <div className="flex flex-col gap-1.5">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-slate-200 bg-white px-3 py-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about skills, projects…"
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none disabled:opacity-60"
              aria-label="Chat message input"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-600 text-white disabled:opacity-40 hover:bg-purple-700 transition-colors flex-shrink-0"
              aria-label="Send message"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-1.5">
            Powered by portfolio AI · Answers from live data
          </p>
        </div>
      </div>
    </>
  );
};

export default AIChatWidget;
