'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAssistantStore } from './useAssistantStore';
import { useAuthStore } from '../auth/authStore';
import { Sparkles, Send, Trash2, Shield, User, Loader2, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatPanelProps {
  onClose?: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ onClose }) => {
  const { messages, isLoading, sendMessage, clearConversation, error } = useAssistantStore();
  const { token, user, initAuth } = useAuthStore();
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !token) return;
    const msg = input;
    setInput('');
    await sendMessage(msg, token);
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] p-6 text-center border rounded-xl bg-surface border-border shadow-md">
        <Shield className="w-12 h-12 mb-4 text-brand-blue" aria-hidden="true" />
        <h2 className="text-xl font-bold text-text-primary">Authentication Required</h2>
        <p className="max-w-md mt-2 text-text-secondary text-sm">
          Please login to interact with the ArenaMind AI Operating System.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto border rounded-2xl bg-surface/75 border-border shadow-lg glass-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-divider bg-surface/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-brand-blue/10">
            <Sparkles className="w-5 h-5 text-brand-blue animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">ArenaMind Assistant</h2>
            <span className="text-[10px] uppercase tracking-wider text-brand-purple font-medium">
              Role: {user?.role || 'FAN'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={clearConversation}
            aria-label="Clear chat history"
            title="Clear Chat History"
            className="p-2 rounded-lg hover:bg-danger/10 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close assistant panel"
              title="Close Panel"
              className="p-2 rounded-lg hover:bg-zinc-800/20 dark:hover:bg-zinc-800/40 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4" role="log" aria-label="Conversation history">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-text-secondary">
            <Sparkles className="w-8 h-8 mb-3 text-brand-purple/50" />
            <p className="text-sm">Hello, {user?.name || 'User'}! How can I assist you with stadium operations, navigation, or schedules today?</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-brand-blue text-white rounded-tr-none'
                    : 'bg-divider text-text-primary rounded-tl-none border border-border/50'
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1 text-[10px] opacity-75 font-semibold">
                  {msg.role === 'user' ? (
                    <>
                      <User className="w-3 h-3" />
                      <span>You</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-brand-purple" />
                      <span>ArenaMind AI</span>
                    </>
                  )}
                </div>
                <div className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</div>
              </div>
            </motion.div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-divider text-text-primary rounded-2xl rounded-tl-none p-3 border border-border/50 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 text-brand-purple animate-spin" />
              <span className="text-sm text-text-secondary">Thinking...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="p-3 text-center text-danger bg-danger/10 border border-danger/20 rounded-xl text-sm">
            Error: {error}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-divider bg-surface/50 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about navigation, food, or emergency...`}
          aria-label="Type your message"
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-surface text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-brand-blue text-sm transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          className="p-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white disabled:opacity-50 disabled:hover:bg-brand-blue transition-colors flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
