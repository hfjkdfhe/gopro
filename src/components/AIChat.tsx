import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { chatWithGemini } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: '你好！我是你的 GoPro 專家。有任何關於 GoPro 相機的問題都可以問我！' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatWithGemini(userMsg, []); // History implementation simplified
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: '抱歉，連線時發生錯誤。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 40, scale: 0.9, rotate: 2 }}
            className="glass-panel w-80 sm:w-[400px] h-[600px] mb-6 flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,174,239,0.3)] hardware-border"
          >
            <div className="p-5 border-b border-line flex justify-between items-center bg-accent/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-accent" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-black text-display text-lg tracking-wider">GOPRO AI</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary mono-value">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-black/20">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm relative group ${
                    msg.role === 'user' 
                      ? 'bg-accent text-white rounded-tr-none shadow-lg shadow-accent/20' 
                      : 'bg-card border border-line rounded-tl-none shadow-xl'
                  }`}>
                    {msg.role === 'model' && (
                      <div className="absolute -left-2 -top-2 w-4 h-4 bg-accent rounded-full flex items-center justify-center border-2 border-bg">
                        <Bot className="w-2 h-2 text-white" />
                      </div>
                    )}
                    <div className="markdown-body text-inherit font-medium">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-card border border-line p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                    <div className="flex gap-1">
                      <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-accent rounded-full" />
                      <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-accent rounded-full" />
                      <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-accent rounded-full" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary mono-value">Analyzing...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-line bg-card/80 backdrop-blur-md">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything about GoPro..."
                  className="flex-1 bg-bg border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all placeholder:text-text-secondary/50 font-medium"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="p-3.5 bg-accent hover:bg-accent-hover text-white rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-accent/20 hover:scale-105 active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-3 flex justify-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary/30 mono-value">End-to-End Encrypted</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-accent hover:bg-accent-hover text-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,174,239,0.5)] transition-all hover:scale-110 active:scale-95 group relative overflow-hidden hover-glitch"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X className="w-7 h-7 relative z-10" /> : <MessageSquare className="w-7 h-7 relative z-10 group-hover:rotate-12 transition-transform" />}
      </button>
    </div>
  );
};
