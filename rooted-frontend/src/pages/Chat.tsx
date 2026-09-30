import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useTranslation } from 'react-i18next';
import { Send, Leaf, Sprout } from 'lucide-react';
import { cn } from '../lib/utils';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { useAuthStore } from '../lib/store';
import { ApiClient } from '../lib/api';
import gsap from 'gsap';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  loading?: boolean;
}

export default function Chat() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: t('chat.initial_greeting', 'Hello. I am the Arborist. How is your garden growing today?'),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantPlaceholderId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantPlaceholderId, role: 'assistant', text: '', loading: true }]);

    try {
      const data = await ApiClient.chat({ message: userMessage.text });

      setMessages(prev => prev.map(msg => 
        msg.id === assistantPlaceholderId 
          ? { ...msg, text: data.response, loading: false } 
          : msg
      ));
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantPlaceholderId 
          ? { ...msg, text: t('chat.error_fallback', 'It seems there is a disruption in the mycelium network. Please try again.'), loading: false } 
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] max-h-[800px]">
      <PageHeader 
        eyebrow={t('chat.eyebrow', 'The Arborist')}
        title={t('chat.title', 'Nurture your growth')} 
        subtitle={t('chat.subtitle', 'Speak to the Arborist about your digital habits, and gently untangle your roots.')}
      />

      <div className="flex-1 overflow-y-auto hide-scrollbar bg-canvas/30 backdrop-blur-sm border border-border/50 rounded-2xl p-4 md:p-6 mb-4 relative shadow-sm">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <Avatar className={cn(
                "w-8 h-8 shrink-0 mt-1",
                msg.role === 'assistant' 
                  ? "bg-sage-100 text-secondary ring-1 ring-sage-200/50" 
                  : "bg-surface ring-1 ring-sage-200/50"
              )}>
                {msg.role === 'assistant' ? (
                  <Sprout size={16} />
                ) : (
                  <AvatarFallback className="text-xs">{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>

              <div className={cn(
                "px-4 py-3 rounded-2xl text-sm md:text-[15px] leading-relaxed relative group",
                msg.role === 'user' 
                  ? "bg-sage-100 text-primary rounded-tr-sm shadow-sm" 
                  : "bg-surface border border-border/50 text-primary rounded-tl-sm shadow-sm"
              )}>
                {msg.loading ? (
                  <div className="flex gap-1 items-center h-5 px-2">
                    <span className="w-1.5 h-1.5 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  msg.text
                )}
                {/* Decorative subtle leaf on assistant messages */}
                {msg.role === 'assistant' && !msg.loading && (
                  <div className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-20 transition-opacity">
                    <Leaf size={16} color="var(--sage-500)" />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={endOfMessagesRef} className="h-2" />
        </div>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="relative flex items-center bg-surface border border-border/60 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-sage-400 focus-within:border-transparent transition-all"
      >
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chat.input_placeholder', 'Share your thoughts with the Arborist...')}
          className="flex-1 bg-transparent px-6 py-4 outline-none text-primary placeholder:text-muted text-[15px]"
          disabled={isLoading}
        />
        <button 
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 mr-2 bg-sage-100 hover:bg-sage-200:bg-sage-700 text-secondary rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-sage-100"
        >
          <Send size={18} className={cn("transition-transform", input.trim() ? "translate-x-0.5 -translate-y-0.5" : "")} />
        </button>
      </form>
    </div>
  );
}
