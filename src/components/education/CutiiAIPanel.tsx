import { useEffect, useRef, useState } from 'react';
import { SendDiagonal, Xmark } from 'iconoir-react';
import { useTranslation } from 'react-i18next';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TypewriterText } from './TypewriterText';
import cutiiAnimated from '@/assets/cutii-assistant.webp';
import cutiiPoster from '@/assets/cutii-assistant-poster.webp';
import '@/styles/education.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface CutiiAIPanelProps {
  courseContext?: {
    id: string;
    title: string;
    level: string;
    topics?: string[];
  };
  lessonContext?: {
    title: string;
    description?: string;
  };
}

const CutiiAvatar = ({ className = '' }: { className?: string }) => (
  <picture className={className}>
    <source media="(prefers-reduced-motion: reduce)" srcSet={cutiiPoster} />
    <img src={cutiiAnimated} alt="" className="h-full w-full object-contain" />
  </picture>
);

const ThinkingLoader = ({ label }: { label: string }) => (
  <div className="cutii-thinking" role="status" aria-label={label}>
    {Array.from({ length: 9 }).map((_, index) => (
      <span key={index} className="cutii-thinking__box" aria-hidden="true" />
    ))}
    <span className="sr-only">{label}</span>
  </div>
);

export const CutiiAIPanel = ({ courseContext, lessonContext }: CutiiAIPanelProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: t('education.cutii.greeting'),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const nextInput = input.trim();
    if (!nextInput || isLoading) return;

    if (!user) {
      toast({
        title: t('education.cutii.sign_in_required_title'),
        description: t('education.cutii.sign_in_required_description'),
        variant: 'destructive',
      });
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: nextInput,
      timestamp: new Date(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (courseContext) {
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          course_id: courseContext.id,
          role: 'user',
          content: nextInput,
        });
      }

      const { data, error } = await supabase.functions.invoke('cutii-chat', {
        body: {
          messages: messages.slice(-10).map(({ role, content }) => ({ role, content })).concat([
            { role: 'user', content: nextInput },
          ]),
          courseContext,
          lessonContext,
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      setMessages((current) => [...current, assistantMessage]);

      if (courseContext) {
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          course_id: courseContext.id,
          role: 'assistant',
          content: data.message,
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '';
      let errorMessage = t('education.cutii.generic_error');
      if (message.includes('rate limit') || message.includes('429')) {
        errorMessage = t('education.cutii.rate_limit_error');
      } else if (message.includes('credits') || message.includes('402')) {
        errorMessage = t('education.cutii.credits_error');
      }
      toast({
        title: t('education.cutii.error'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="cutii-launcher"
        aria-label={t('education.cutii.title')}
        aria-haspopup="dialog"
      >
        <CutiiAvatar className="block h-[70px] w-[70px]" />
        <span className="cutii-launcher__label">{t('education.cutii.title')}</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="cutii-overlay"
          className="cutii-panel"
          onEscapeKeyDown={() => setIsOpen(false)}
        >
          <header className="cutii-panel__header">
            <div className="flex min-w-0 items-center gap-3">
              <CutiiAvatar className="block h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#091321]" />
              <div className="min-w-0">
                <DialogTitle className="truncate text-base font-bold text-white">
                  {t('education.cutii.title')}
                </DialogTitle>
                <p className="mt-0.5 text-xs text-slate-400">
                  {t('education.cutii.status', { defaultValue: 'Course assistant' })}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="cutii-close"
              aria-label={t('common.close', { defaultValue: 'Close' })}
            >
              <Xmark className="h-5 w-5" strokeWidth={1.7} />
            </button>
          </header>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-4 px-4 py-5 sm:px-5">
              {messages.map((message, index) => (
                <div key={`${message.timestamp.getTime()}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`cutii-message ${message.role === 'user' ? 'cutii-message--user' : 'cutii-message--assistant'}`}>
                    <p className="whitespace-pre-wrap text-sm leading-6">
                      {message.role === 'assistant' && index === messages.length - 1 && !isLoading
                        ? <TypewriterText text={message.content} />
                        : message.content}
                    </p>
                    <time className="mt-1.5 block text-[10px] opacity-55">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="cutii-message cutii-message--assistant cutii-message--thinking">
                    <ThinkingLoader label={t('education.cutii.thinking', { defaultValue: 'CUTİİ is thinking' })} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <form
            className="cutii-composer"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSend();
            }}
          >
            <label htmlFor="cutii-message" className="sr-only">
              {t('education.cutii.input_placeholder')}
            </label>
            <textarea
              id="cutii-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void handleSend();
                }
              }}
              placeholder={t('education.cutii.input_placeholder')}
              disabled={isLoading}
              rows={1}
              className="cutii-composer__input"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="cutii-send"
              aria-label={t('education.cutii.send', { defaultValue: 'Send message' })}
            >
              <SendDiagonal className="h-5 w-5" strokeWidth={1.8} />
            </button>
            <p className="col-span-2 text-center text-[10px] leading-4 text-slate-500">
              {t('education.cutii.footer_disclaimer')}
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
