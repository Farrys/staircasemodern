import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  BadgeCheck,
  Headset,
  MessageCircle,
  PhoneCall,
  Send,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import { createChatSupabaseClient, supabase } from '@/lib/supabase';
import { siteConfig } from '@/lib/siteConfig';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { isEmail, minLength } from '@/lib/validators';
import type { ChatEntry, ChatSender, ChatSession } from '@/types';

type Sender = ChatSender;

interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  time: string;
  createdAt?: string;
}

const quickFlows = [
  {
    label: 'Нужен быстрый расчёт',
    draft: 'Здравствуйте! Хочу быстрый расчёт стоимости лестницы для частного дома.',
    reply: 'Конечно. Напишите примерную высоту, тип лестницы и предпочтительный материал. Мы подготовим ориентир по бюджету и срокам.',
  },
  {
    label: 'Подбор материала',
    draft: 'Помогите подобрать материал лестницы под интерьер и ежедневную нагрузку.',
    reply: 'Подскажем по сочетанию металла, дуба, стекла и отделки. Если отправите стиль интерьера и фото помещения, ответ будет точнее.',
  },
  {
    label: 'Хочу выезд замерщика',
    draft: 'Хочу согласовать выезд замерщика на объект.',
    reply: 'Отлично. Оставьте район, удобный день и номер телефона. Менеджер согласует время визита и подготовит список вопросов перед выездом.',
  },
];

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome',
    sender: 'manager',
    text: 'Здравствуйте. Это онлайн-чат Staircase Pro. Поможем с расчётом, подбором конструкции, материалами и организацией выезда замерщика.',
    time: 'сейчас',
  },
  {
    id: 'prompt',
    sender: 'system',
    text: 'Выберите готовый сценарий ниже или напишите вопрос своими словами.',
    time: 'сейчас',
  },
];

const storageKeys = {
  sessionId: 'support-chat-session-id',
  sessionToken: 'support-chat-session-token',
  lead: 'support-chat-lead',
  lastSeen: 'support-chat-last-seen',
};

function ensureChatToken() {
  const existing = localStorage.getItem(storageKeys.sessionToken);
  if (existing) return existing;
  const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, '');
  localStorage.setItem(storageKeys.sessionToken, token);
  return token;
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function mapEntries(entries: ChatEntry[]): ChatMessage[] {
  return entries.map((entry) => ({
    id: entry.id,
    sender: entry.sender,
    text: entry.text,
    time: formatTime(entry.created_at),
    createdAt: entry.created_at,
  }));
}

export function FloatingSupportWidget() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(() => localStorage.getItem(storageKeys.sessionId));
  const [chatToken, setChatToken] = useState<string>(() => ensureChatToken());
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [lastSeenManagerAt, setLastSeenManagerAt] = useState<string | null>(() => localStorage.getItem(storageKeys.lastSeen));
  const [lead, setLead] = useState(() => {
    const saved = localStorage.getItem(storageKeys.lead);
    if (!saved) return { name: '', email: '', phone: '' };

    try {
      return JSON.parse(saved) as { name: string; email: string; phone: string };
    } catch {
      return { name: '', email: '', phone: '' };
    }
  });
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKeys.lead, JSON.stringify(lead));
  }, [lead]);

  useEffect(() => {
    if (lastSeenManagerAt) localStorage.setItem(storageKeys.lastSeen, lastSeenManagerAt);
    else localStorage.removeItem(storageKeys.lastSeen);
  }, [lastSeenManagerAt]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, open, typing]);

  useEffect(() => {
    if (!open) return;
    const latestManagerMessage = [...messages].reverse().find((message) => message.sender === 'manager' && message.createdAt);
    if (latestManagerMessage?.createdAt) {
      setLastSeenManagerAt(latestManagerMessage.createdAt);
    }
  }, [open, messages]);

  useEffect(() => {
    if (!sessionId) {
      setMessages(initialMessages);
      setChatSession(null);
      return;
    }

    let active = true;
    const chatClient = createChatSupabaseClient(chatToken);

    const loadSession = async () => {
      const { data, error } = await chatClient
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      if (active) {
        setChatSession((data as ChatSession | null) ?? null);
      }
    };

    const loadMessages = async () => {
      const { data, error } = await chatClient
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      if (active) {
        const mapped = mapEntries((data ?? []) as ChatEntry[]);
        setMessages(mapped.length > 0 ? mapped : initialMessages);
      }
    };

    void loadSession();
    void loadMessages();
    const intervalId = window.setInterval(() => {
      void loadSession();
      void loadMessages();
    }, open ? 2500 : 5000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [chatToken, open, sessionId]);

  const canSubmitLead = useMemo(
    () => minLength(lead.name, 2) && isEmail(lead.email),
    [lead],
  );

  const unreadManagerReplies = useMemo(() => {
    return messages.filter((message) => {
      if (message.sender !== 'manager' || !message.createdAt) return false;
      if (!lastSeenManagerAt) return true;
      return new Date(message.createdAt).getTime() > new Date(lastSeenManagerAt).getTime();
    }).length;
  }, [messages, lastSeenManagerAt]);

  const hasManagerConnected = useMemo(() => {
    if (chatSession?.last_sender === 'manager') return true;
    return messages.some((message) => message.sender === 'manager');
  }, [chatSession?.last_sender, messages]);

  const chatStatusLabel = useMemo(() => {
    if (chatSession?.status === 'closed') return 'Диалог закрыт';
    if (hasManagerConnected) return 'Менеджер подключился';
    if (sessionId) return 'Диалог сохранён';
    return 'Менеджер на связи';
  }, [chatSession?.status, hasManagerConnected, sessionId]);

  const chatStatusHint = useMemo(() => {
    if (unreadManagerReplies > 0) return `Новых ответов: ${unreadManagerReplies}`;
    if (chatSession?.status === 'closed') return 'Можно открыть новый диалог в любой момент';
    if (hasManagerConnected) return 'Ответы поступают в эту же переписку';
    if (sessionId) return 'История не потеряется';
    return 'Ответ в течение 10-15 минут';
  }, [chatSession?.status, hasManagerConnected, sessionId, unreadManagerReplies]);

  const upsertSession = async (payload: Partial<ChatSession>) => {
    const chatClient = createChatSupabaseClient(chatToken);

    if (sessionId) {
      const { error } = await chatClient.from('chat_sessions').update(payload).eq('id', sessionId);
      if (error) throw error;
      return sessionId;
    }

    const { data, error } = await chatClient
      .from('chat_sessions')
      .insert({
        client_token: chatToken,
        name: lead.name || null,
        email: lead.email || null,
        phone: lead.phone || null,
        status: 'new',
        ...payload,
      })
      .select('*')
      .single();

    if (error || !data) throw error ?? new Error('Не удалось создать чат-сессию');

    localStorage.setItem(storageKeys.sessionId, data.id);
    setSessionId(data.id);
    return data.id;
  };

  const appendEntry = async (sender: Sender, text: string, nextStatus?: ChatSession['status']) => {
    const chatClient = createChatSupabaseClient(chatToken);
    const targetSessionId = await upsertSession({
      name: lead.name || null,
      email: lead.email || null,
      phone: lead.phone || null,
      status: nextStatus ?? 'active',
      last_message: text,
      last_sender: sender,
      last_message_at: new Date().toISOString(),
    });

    const { error } = await chatClient.from('chat_messages').insert({
      session_id: targetSessionId,
      sender,
      text,
    });

    if (error) throw error;
    return targetSessionId;
  };

  const pushManagerReply = (text: string) => {
    setTyping(true);
    window.setTimeout(() => {
      void appendEntry('manager', text).catch((error: { message?: string }) => {
        toast.error(error.message ?? 'Не удалось сохранить ответ менеджера');
      }).finally(() => {
        setTyping(false);
      });
    }, 900);
  };

  const sendMessage = async () => {
    if (!minLength(draft, 3)) {
      toast.error('Напишите вопрос, чтобы начать диалог');
      return;
    }

    const text = draft;
    setDraft('');

    try {
      await appendEntry('client', text);
      pushManagerReply('Сообщение получено. Если хотите, сразу оставьте контакты ниже, и менеджер продолжит диалог по телефону или почте без потери контекста.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось отправить сообщение';
      toast.error(message);
    }
  };

  const useFlow = async (flow: (typeof quickFlows)[number]) => {
    try {
      await appendEntry('client', flow.draft);
      pushManagerReply(flow.reply);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось применить сценарий';
      toast.error(message);
    }
  };

  const submitLead = async () => {
    const clientMessages = messages.filter((message) => message.sender === 'client');
    const fallbackText = draft || clientMessages[clientMessages.length - 1]?.text || '';
    if (!canSubmitLead || !minLength(fallbackText, 3)) {
      toast.error('Укажите имя, email и кратко опишите задачу в чате');
      return;
    }

    const transcript = messages
      .filter((message) => message.sender !== 'system')
      .map((message) => `${message.sender === 'client' ? 'Клиент' : 'Менеджер'}: ${message.text}`)
      .join('\n');

    const text = `[онлайн-чат]\n${transcript || `Клиент: ${fallbackText}`}`;

    setSending(true);

    try {
      const targetSessionId = await upsertSession({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || null,
        status: 'active',
        last_message: text,
        last_sender: 'client',
        last_message_at: new Date().toISOString(),
      });

      const [messageInsert, functionInvoke, systemReply] = await Promise.allSettled([
        supabase.from('messages').insert({
          name: lead.name,
          email: lead.email,
          phone: lead.phone || null,
          text,
        }),
        supabase.functions.invoke('contact-message', {
          body: {
            ...lead,
            text,
          },
        }),
        createChatSupabaseClient(chatToken).from('chat_messages').insert({
          session_id: targetSessionId,
          sender: 'system',
          text: 'Контакты сохранены. Менеджер видит диалог и вернётся с ответом в ближайшее время.',
        }),
      ]);

      const insertError =
        messageInsert.status === 'fulfilled' ? messageInsert.value.error : new Error('messages insert failed');
      const functionError =
        functionInvoke.status === 'fulfilled' ? functionInvoke.value.error : new Error('contact function failed');
      const systemReplyError =
        systemReply.status === 'fulfilled' ? systemReply.value.error : new Error('chat system reply failed');

      if (insertError && functionError && systemReplyError) {
        throw insertError;
      }

      toast.success('Чат передан менеджеру');
      setLead((prev) => ({ ...prev, phone: '' }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось передать обращение';
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  const clearChat = async () => {
    setDraft('');
    setLead({ name: '', email: '', phone: '' });
    setMessages(initialMessages);
    setLastSeenManagerAt(null);
    localStorage.removeItem(storageKeys.lead);
    localStorage.removeItem(storageKeys.sessionId);
    localStorage.removeItem(storageKeys.lastSeen);
    localStorage.removeItem(storageKeys.sessionToken);
    setSessionId(null);
    setChatToken(ensureChatToken());
  };

  return (
    <div
      id="chat"
      className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-1rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6 sm:max-w-[calc(100vw-2.5rem)]"
    >
      {open && (
        <div className="glass-panel warm-ring w-[min(23.5rem,calc(100vw-1rem))] overflow-hidden rounded-[30px] shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:w-[min(24rem,calc(100vw-2.5rem))]">
          <div className="surface-gradient border-b border-border px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                  <Headset className="h-4 w-4 text-brand" />
                  Онлайн-консьерж проекта
                </div>
                <p className="mt-1 text-xs text-text-secondary">Соберите ключевые вводные по проекту и передайте их менеджеру одним сообщением.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-border p-2 transition hover:border-brand hover:text-brand"
                style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 88%, white 12%)' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              className="mt-4 flex items-center justify-between rounded-2xl px-3 py-2 text-xs text-text-secondary"
              style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 82%, white 18%)' }}
            >
              <span className="inline-flex items-center gap-2 font-semibold text-text-primary">
                <BadgeCheck className="h-4 w-4 text-brand" />
                {chatStatusLabel}
              </span>
              <span>{chatStatusHint}</span>
            </div>
          </div>

          <div ref={bodyRef} className="max-h-[min(18rem,28vh)] space-y-3 overflow-y-auto px-4 py-4 sm:max-h-[19rem]">
            {messages.map((message) => {
              const isClient = message.sender === 'client';
              const isSystem = message.sender === 'system';
              return (
                <div key={message.id} className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-[24px] px-4 py-3 text-sm leading-6 ${
                      isClient
                        ? 'bg-brand text-white shadow-glow'
                        : isSystem
                          ? 'border border-dashed border-border text-text-secondary'
                          : 'border border-border text-text-primary shadow-card'
                    }`}
                    style={
                      isClient
                        ? undefined
                        : isSystem
                          ? { background: 'color-mix(in srgb, var(--panel-bg-main) 82%, white 18%)' }
                          : { background: 'color-mix(in srgb, var(--panel-bg-main) 90%, white 10%)' }
                    }
                  >
                    {!isClient && !isSystem && (
                      <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-brand">
                        <UserRound className="h-3.5 w-3.5" />
                        Менеджер проекта
                      </div>
                    )}
                    <p>{message.text}</p>
                    <p className={`mt-2 text-[11px] ${isClient ? 'text-white/80' : 'text-text-secondary/80'}`}>{message.time}</p>
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="flex justify-start">
                <div
                  className="rounded-[24px] border border-border px-4 py-3 text-sm text-text-secondary shadow-card"
                  style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 90%, white 10%)' }}
                >
                  Менеджер печатает...
                </div>
              </div>
            )}
          </div>

          <div className="max-h-[min(21rem,36vh)] overflow-y-auto border-t border-border px-4 py-4 sm:max-h-none">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickFlows.map((flow) => (
                <button
                  key={flow.label}
                  onClick={() => void useFlow(flow)}
                  className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-text-secondary transition hover:border-brand hover:text-brand"
                  style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 88%, white 12%)' }}
                >
                  {flow.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <Textarea
                label="Сообщение"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="min-h-24"
                placeholder="Опишите проём, материал, стиль интерьера или срок запуска проекта"
              />

              <div className="grid gap-3">
                <Input label="Ваше имя" value={lead.name} onChange={(event) => setLead((prev) => ({ ...prev, name: event.target.value }))} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="Email" value={lead.email} onChange={(event) => setLead((prev) => ({ ...prev, email: event.target.value }))} />
                  <Input label="Телефон" value={lead.phone} onChange={(event) => setLead((prev) => ({ ...prev, phone: event.target.value }))} />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button variant="outline" onClick={() => void sendMessage()}>
                  <Send className="h-4 w-4" />
                  Отправить в чат
                </Button>
                <Button loading={sending} onClick={() => void submitLead()}>
                  <Sparkles className="h-4 w-4" />
                  Передать менеджеру
                </Button>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs text-text-secondary">
                <a href={siteConfig.contacts.phoneHref} className="inline-flex items-center gap-2 font-semibold text-brand">
                  <PhoneCall className="h-4 w-4" />
                  Позвонить сейчас
                </a>
                <button onClick={() => void clearChat()} className="transition hover:text-brand">
                  Очистить диалог
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex max-w-full items-center gap-3 rounded-full border border-[#b98557]/20 bg-gradient-to-r from-brand to-[#c79661] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(138,90,54,0.28)] transition hover:-translate-y-0.5"
      >
        {open ? <X className="h-5 w-5" /> : <><MessageCircle className="h-5 w-5" /><Sparkles className="h-4 w-4" /></>}
        {open ? 'Свернуть чат' : 'Онлайн-чат'}
        {!open && unreadManagerReplies > 0 && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
            {unreadManagerReplies}
          </span>
        )}
      </button>
    </div>
  );
}
