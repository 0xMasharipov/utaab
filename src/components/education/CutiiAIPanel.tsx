import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Expand, SendDiagonal, Xmark } from 'iconoir-react';
import { Orb } from '@yogesharc/thinking-orbs';
import { useTranslation } from 'react-i18next';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TypewriterText } from './TypewriterText';
import cutiiAnimated from '@/assets/cutii-assistant.webp';
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
    <img src={cutiiAnimated} alt="" className="h-full w-full object-contain" />
  </picture>
);

const ThinkingLoader = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 text-sm text-slate-300" role="status">
    <Orb state="reasoning" size={20} label={label} className="text-sky-400" />
    <span>{label}</span>
  </div>
);

export const CutiiAIPanel = ({ courseContext, lessonContext }: CutiiAIPanelProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [windowRect, setWindowRect] = useState({ x: 0, y: 0, width: 860, height: 680 });
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
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const interactionRef = useRef<{
    mode: 'drag' | 'resize';
    edge?: string;
    startX: number;
    startY: number;
    rect: typeof windowRect;
  } | null>(null);
  const breakpoint = useBreakpoint();
  const isDesktop = breakpoint === 'desktop';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('cutii-panel-open');
    } else {
      document.body.classList.remove('cutii-panel-open');
    }
    return () => document.body.classList.remove('cutii-panel-open');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isDesktop) {
      setIsMaximized(false);
      return;
    }

    const fitToViewport = () => {
      setWindowRect((current) => {
        const width = Math.min(Math.max(500, current.width), window.innerWidth - 32);
        const height = Math.min(Math.max(400, current.height), window.innerHeight - 32);
        return {
          width,
          height,
          x: Math.min(Math.max(16, current.x || (window.innerWidth - width) / 2), window.innerWidth - width - 16),
          y: Math.min(Math.max(16, current.y || (window.innerHeight - height) / 2), window.innerHeight - height - 16),
        };
      });
    };

    fitToViewport();
    window.addEventListener('resize', fitToViewport);
    return () => window.removeEventListener('resize', fitToViewport);
  }, [isDesktop, isOpen]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const interaction = interactionRef.current;
      if (!interaction || !isDesktop || isMaximized) return;
      const dx = event.clientX - interaction.startX;
      const dy = event.clientY - interaction.startY;

      if (interaction.mode === 'drag') {
        setWindowRect((current) => ({
          ...current,
          x: Math.min(Math.max(8, interaction.rect.x + dx), window.innerWidth - current.width - 8),
          y: Math.min(Math.max(8, interaction.rect.y + dy), window.innerHeight - current.height - 8),
        }));
        return;
      }

      const edge = interaction.edge ?? '';
      let { x, y, width, height } = interaction.rect;
      if (edge.includes('e')) width = Math.min(window.innerWidth - x - 8, Math.max(500, width + dx));
      if (edge.includes('s')) height = Math.min(window.innerHeight - y - 8, Math.max(400, height + dy));
      if (edge.includes('w')) {
        const nextWidth = Math.min(x + width - 8, Math.max(500, width - dx));
        x += width - nextWidth;
        width = nextWidth;
      }
      if (edge.includes('n')) {
        const nextHeight = Math.min(y + height - 8, Math.max(400, height - dy));
        y += height - nextHeight;
        height = nextHeight;
      }
      setWindowRect({ x, y, width, height });
    };

    const stopInteraction = () => {
      interactionRef.current = null;
      document.body.classList.remove('cutii-window-interacting');
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopInteraction);
    window.addEventListener('pointercancel', stopInteraction);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopInteraction);
      window.removeEventListener('pointercancel', stopInteraction);
      document.body.classList.remove('cutii-window-interacting');
    };
  }, [isDesktop, isMaximized]);

  const startInteraction = (
    event: ReactPointerEvent<HTMLElement>,
    mode: 'drag' | 'resize',
    edge?: string,
  ) => {
    if (!isDesktop || isMaximized || event.button !== 0) return;
    event.preventDefault();
    interactionRef.current = {
      mode,
      edge,
      startX: event.clientX,
      startY: event.clientY,
      rect: windowRect,
    };
    document.body.classList.add('cutii-window-interacting');
  };

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
        ref={launcherRef}
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
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            launcherRef.current?.focus();
          }}
          style={isDesktop && !isMaximized ? {
            '--cutii-window-x': `${windowRect.x}px`,
            '--cutii-window-y': `${windowRect.y}px`,
            '--cutii-window-width': `${windowRect.width}px`,
            '--cutii-window-height': `${windowRect.height}px`,
          } : undefined}
          data-desktop={isDesktop ? 'true' : 'false'}
          data-maximized={isMaximized ? 'true' : 'false'}
        >
          <header
            className="cutii-panel__header"
            onPointerDown={(event) => {
              if ((event.target as HTMLElement).closest('button')) return;
              startInteraction(event, 'drag');
            }}
          >
            <div className="flex min-w-0 items-center gap-3">
              <CutiiAvatar className="block h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#091321]" />
              <div className="min-w-0">
                <DialogTitle className="truncate text-base font-bold text-white">
                  {t('education.cutii.title')}
                </DialogTitle>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                  <Orb state={isLoading ? 'reasoning' : 'base'} size={14} className="text-sky-400" />
                  {t('education.cutii.status', { defaultValue: 'Course assistant' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isDesktop && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMaximized((current) => !current)}
                  className="cutii-close"
                  aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
                  title={isMaximized ? 'Restore window' : 'Maximize window'}
                >
                  <Expand className={`h-5 w-5 ${isMaximized ? 'rotate-180' : ''}`} strokeWidth={1.7} />
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="cutii-close"
                aria-label={t('common.close', { defaultValue: 'Close' })}
              >
                <Xmark className="h-5 w-5" strokeWidth={1.7} />
              </Button>
            </div>
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
              ref={inputRef}
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
          {isDesktop && !isMaximized && (
            <>
              {['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'].map((edge) => (
                <span
                  key={edge}
                  aria-hidden="true"
                  className={`cutii-resize-handle cutii-resize-handle--${edge}`}
                  onPointerDown={(event) => startInteraction(event, 'resize', edge)}
                />
              ))}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
