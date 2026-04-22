import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { TypewriterText } from './TypewriterText';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CutiiAIPanelProps {
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

export const CutiiAIPanel = ({ courseContext, lessonContext }: CutiiAIPanelProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: t('Hi! I\'m CUTII, your AI learning assistant. Ask me anything about blockchain, smart contracts, or this course!'),
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ width: 0, height: 0, mouseX: 0, mouseY: 0 });
  const [sessionVerified, setSessionVerified] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMobile) {
      const updatePosition = () => {
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;
        setPosition({
          x: Math.max(0, Math.min(position.x, maxX)),
          y: Math.max(0, Math.min(position.y, maxY))
        });
      };
      updatePosition();
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [isOpen, isMobile, size, position.x, position.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile || isMaximized) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isMobile || isMaximized) return;
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      width: size.width,
      height: size.height,
      mouseX: e.clientX,
      mouseY: e.clientY
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(e.clientX - dragStartRef.current.x, window.innerWidth - size.width)),
          y: Math.max(0, Math.min(e.clientY - dragStartRef.current.y, window.innerHeight - size.height))
        });
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeStartRef.current.mouseX;
        const deltaY = e.clientY - resizeStartRef.current.mouseY;
        setSize({
          width: Math.max(500, Math.min(resizeStartRef.current.width + deltaX, window.innerWidth)),
          height: Math.max(400, Math.min(resizeStartRef.current.height + deltaY, window.innerHeight))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, size.width, size.height]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use the AI assistant",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Save user message to database
      if (courseContext) {
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          course_id: courseContext.id,
          role: 'user',
          content: input,
        });
      }

      // Call AI
      const { data, error } = await supabase.functions.invoke('cutii-chat', {
        body: {
          messages: messages.slice(-10).map(m => ({ // Last 10 messages for context
            role: m.role,
            content: m.content,
          })).concat([{ role: 'user', content: input }]),
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

      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant message to database
      if (courseContext) {
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          course_id: courseContext.id,
          role: 'assistant',
          content: data.message,
        });
      }

    } catch (error: any) {
      // Error details are not logged to prevent information leakage
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (error.message?.includes('rate limit') || error.message?.includes('429')) {
        errorMessage = 'I\'m receiving too many requests right now. Please wait a moment and try again.';
      } else if (error.message?.includes('credits') || error.message?.includes('402')) {
        errorMessage = 'AI service is temporarily unavailable. Please try again later.';
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg glass-strong border border-white/30 hover:bg-white/10 transition-all"
        size="icon"
      >
        <Bot className="h-6 w-6 text-accent" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={`p-0 gap-0 border border-white/30 cutii-ai-dialog ${
            isMobile || isMaximized 
              ? 'w-screen h-screen max-w-none rounded-none' 
              : 'max-w-none'
          }`}
          style={
          isMobile || isMaximized
              ? {
                  background: 'radial-gradient(ellipse at 20% 30%, rgba(59, 130, 246, 0.10) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(99, 179, 237, 0.06) 0%, transparent 50%), rgba(8, 13, 26, 0.95)',
                  backdropFilter: 'blur(32px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                  animation: 'liquidGlass 10s ease-in-out infinite',
                }
              : {
                  width: `${size.width}px`,
                  height: `${size.height}px`,
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  transform: 'none',
                  background: 'radial-gradient(ellipse at 20% 30%, rgba(59, 130, 246, 0.10) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(99, 179, 237, 0.06) 0%, transparent 50%), rgba(8, 13, 26, 0.95)',
                  backdropFilter: 'blur(32px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                  position: 'fixed',
                  animation: 'liquidGlass 10s ease-in-out infinite',
                }
          }
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={() => setIsOpen(false)}
        >
          {/* Header */}
          <div 
            className={`flex items-center justify-between p-4 border-b border-white/10 ${
              !isMobile && !isMaximized ? 'cursor-move' : ''
            }`}
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">CUTII AI Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsMaximized(!isMaximized)}
                >
                  {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 animate-fade-in ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'glass'
                    }`}
                  >
                    <p className="text-sm">
                      {message.role === 'assistant' && idx === messages.length - 1 && !isLoading ? (
                        <TypewriterText text={message.content} />
                      ) : (
                        <span className="whitespace-pre-wrap">{message.content}</span>
                      )}
                    </p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="glass rounded-2xl px-4 py-3 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="glass flex-1"
                disabled={isLoading}
                autoFocus
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="btn-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Educational use only • Not financial advice
            </p>
          </div>

          {/* Resize Handle - Desktop Only */}
          {!isMobile && !isMaximized && (
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
              onMouseDown={handleResizeMouseDown}
              style={{
                background: 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.2) 50%)',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
