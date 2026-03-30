import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Mailbox } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { MessageTable } from '@/components/admin/MessageTable';
import { Drawer } from '@/components/ui/Drawer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { supabase } from '@/lib/supabase';
import type { ChatEntry, ChatSession, Message } from '@/types';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [chatEntries, setChatEntries] = useState<ChatEntry[]>([]);
  const [reply, setReply] = useState('');
  const [replying, setReplying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'unprocessed' | 'all'>('unprocessed');
  const [chatFilter, setChatFilter] = useState<'all' | ChatSession['status']>('all');

  const load = async () => {
    setLoading(true);
    const [messagesResult, sessionsResult] = await Promise.all([
      supabase.from('messages').select('*').order('created_at', { ascending: false }),
      supabase.from('chat_sessions').select('*').order('last_message_at', { ascending: false }),
    ]);

    if (messagesResult.error) toast.error(messagesResult.error.message);
    if (sessionsResult.error) toast.error(sessionsResult.error.message);

    setMessages(messagesResult.data ?? []);
    setChatSessions((sessionsResult.data as ChatSession[]) ?? []);
    setLoading(false);
  };

  const loadChatEntries = async (sessionId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      toast.error(error.message);
      return;
    }

    setChatEntries((data as ChatEntry[]) ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('admin-messages-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        void load();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions' }, () => {
        void load();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, (payload) => {
        if (selectedSession?.id && payload.new && 'session_id' in payload.new && payload.new.session_id === selectedSession.id) {
          void loadChatEntries(selectedSession.id);
        }
        void load();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [selectedSession?.id]);

  const filtered = useMemo(() => filter === 'all' ? messages : messages.filter((item) => !item.is_processed), [messages, filter]);
  const filteredSessions = useMemo(
    () => chatSessions.filter((item) => chatFilter === 'all' || item.status === chatFilter),
    [chatSessions, chatFilter],
  );
  const activeSessions = useMemo(() => chatSessions.filter((item) => item.status !== 'closed'), [chatSessions]);

  const markProcessed = async (message: Message) => {
    const { error } = await supabase.from('messages').update({ is_processed: true }).eq('id', message.id);
    if (error) return toast.error(error.message);
    toast.success('Сообщение отмечено как обработанное');
    await load();
  };

  const openSession = async (session: ChatSession) => {
    setSelectedSession(session);
    setReply('');
    await loadChatEntries(session.id);
  };

  const sendReply = async () => {
    if (!selectedSession || !reply.trim()) return;

    setReplying(true);
    const text = reply.trim();

    const [insertResult, updateResult] = await Promise.all([
      supabase.from('chat_messages').insert({
        session_id: selectedSession.id,
        sender: 'manager',
        text,
      }),
      supabase.from('chat_sessions').update({
        status: 'active',
        last_message: text,
        last_sender: 'manager',
        last_message_at: new Date().toISOString(),
      }).eq('id', selectedSession.id),
    ]);

    setReplying(false);

    if (insertResult.error || updateResult.error) {
      return toast.error(insertResult.error?.message || updateResult.error?.message || 'Не удалось отправить ответ');
    }

    toast.success('Ответ отправлен');
    setReply('');
    await loadChatEntries(selectedSession.id);
    await load();
  };

  const updateSessionStatus = async (session: ChatSession, status: ChatSession['status']) => {
    const { error } = await supabase.from('chat_sessions').update({ status }).eq('id', session.id);
    if (error) return toast.error(error.message);

    toast.success(status === 'closed' ? 'Диалог закрыт' : 'Статус диалога обновлён');

    if (selectedSession?.id === session.id) {
      setSelectedSession({ ...selectedSession, status });
    }

    await load();
  };

  return (
    <PageWrapper>
      <div className="grid gap-8 lg:grid-cols-[260px,1fr]">
        <AdminSidebar />
        <div>
          <div className="mb-6 grid gap-6 lg:grid-cols-[1fr,0.8fr]">
            <div>
              <div className="eyebrow">входящие заявки</div>
              <h1 className="mt-5 text-3xl font-bold">Обращения</h1>
              <p className="mt-2 text-text-secondary">Здесь собираются сообщения из формы и онлайн-чата. Новые обращения появляются в ленте автоматически, без ручного обновления страницы.</p>
            </div>
            <div className="rounded-[24px] bg-brand-light p-5 text-sm leading-7 text-text-secondary">
              Отмечайте обращения обработанными после первого контакта, а по активным диалогам отвечайте прямо из админки, чтобы переписка не терялась между каналами.
            </div>
          </div>

          <div className="mb-6 flex gap-3">
            <button className={`rounded-2xl px-4 py-2 text-sm font-semibold ${filter === 'unprocessed' ? 'bg-brand text-white shadow-card' : 'bg-brand-light text-brand'}`} onClick={() => setFilter('unprocessed')}>Необработанные</button>
            <button className={`rounded-2xl px-4 py-2 text-sm font-semibold ${filter === 'all' ? 'bg-brand text-white shadow-card' : 'bg-brand-light text-brand'}`} onClick={() => setFilter('all')}>Все</button>
          </div>

          {loading ? <Spinner /> : (
            <div className="space-y-10">
              <section>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Realtime-чат</h2>
                    <p className="mt-2 text-sm text-text-secondary">Активные диалоги из онлайн-чата. Можно открыть переписку и ответить клиенту прямо из панели.</p>
                  </div>
                  <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">{activeSessions.length} активных</span>
                </div>
                <div className="mb-4 flex flex-wrap gap-3">
                  <button className={`rounded-2xl px-4 py-2 text-sm font-semibold ${chatFilter === 'all' ? 'bg-brand text-white shadow-card' : 'bg-brand-light text-brand'}`} onClick={() => setChatFilter('all')}>Все диалоги</button>
                  <button className={`rounded-2xl px-4 py-2 text-sm font-semibold ${chatFilter === 'new' ? 'bg-brand text-white shadow-card' : 'bg-brand-light text-brand'}`} onClick={() => setChatFilter('new')}>Новые</button>
                  <button className={`rounded-2xl px-4 py-2 text-sm font-semibold ${chatFilter === 'active' ? 'bg-brand text-white shadow-card' : 'bg-brand-light text-brand'}`} onClick={() => setChatFilter('active')}>В работе</button>
                  <button className={`rounded-2xl px-4 py-2 text-sm font-semibold ${chatFilter === 'closed' ? 'bg-brand text-white shadow-card' : 'bg-brand-light text-brand'}`} onClick={() => setChatFilter('closed')}>Закрытые</button>
                </div>
                {filteredSessions.length === 0 ? (
                  <EmptyState icon={Mailbox} title="Диалоги пока не поступали" />
                ) : (
                  <div className="grid gap-4 xl:grid-cols-2">
                    {filteredSessions.map((session) => (
                      <Card key={session.id} className="texture-panel">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="font-bold">{session.name || 'Новый посетитель'}</h3>
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                session.status === 'new'
                                  ? 'bg-[#f8e7bf] text-[#78581c]'
                                  : session.status === 'active'
                                    ? 'bg-[#dce8d8] text-[#31543a]'
                                    : 'bg-[#e2e2e2] text-[#5b5b5b]'
                              }`}>
                                {session.status === 'new' ? 'Новый чат' : session.status === 'active' ? 'В работе' : 'Закрыт'}
                              </span>
                            </div>
                            <div className="mt-3 space-y-1 text-sm text-text-secondary">
                              {session.email && <p>{session.email}</p>}
                              {session.phone && <p>{session.phone}</p>}
                              <p>{new Date(session.last_message_at).toLocaleString('ru-RU')}</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button variant="outline" onClick={() => void openSession(session)}>Открыть диалог</Button>
                            {session.status !== 'active' && (
                              <Button variant="secondary" onClick={() => void updateSessionStatus(session, 'active')}>
                                Взять в работу
                              </Button>
                            )}
                            {session.status !== 'closed' && (
                              <Button variant="outline" onClick={() => void updateSessionStatus(session, 'closed')}>
                                Закрыть
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-text-secondary">{session.last_message || 'Сообщение появится после первого ответа клиента.'}</p>
                      </Card>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">Форма и fallback-обращения</h2>
                  <p className="mt-2 text-sm text-text-secondary">Одиночные сообщения из формы и резервного канала. Их можно отдельно отмечать как обработанные.</p>
                </div>
                {filtered.length === 0 ? <EmptyState icon={Mailbox} title="Сообщения не найдены" /> : <MessageTable messages={filtered} onMarkProcessed={(message) => void markProcessed(message)} />}
              </section>
            </div>
          )}
        </div>
      </div>

      <Drawer open={Boolean(selectedSession)} title={selectedSession?.name || 'Диалог с клиентом'} onClose={() => setSelectedSession(null)}>
        {selectedSession && (
          <div className="space-y-6">
            <Card className="texture-panel">
              <div className="grid gap-2 text-sm text-text-secondary">
                {selectedSession.email && <p><span className="font-semibold text-text-primary">Email:</span> {selectedSession.email}</p>}
                {selectedSession.phone && <p><span className="font-semibold text-text-primary">Телефон:</span> {selectedSession.phone}</p>}
                <p><span className="font-semibold text-text-primary">Статус:</span> {selectedSession.status === 'new' ? 'Новый чат' : selectedSession.status === 'active' ? 'В работе' : 'Закрыт'}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {selectedSession.status !== 'active' && (
                  <Button variant="secondary" onClick={() => void updateSessionStatus(selectedSession, 'active')}>
                    Взять в работу
                  </Button>
                )}
                {selectedSession.status !== 'closed' && (
                  <Button variant="outline" onClick={() => void updateSessionStatus(selectedSession, 'closed')}>
                    Закрыть диалог
                  </Button>
                )}
              </div>
            </Card>

            <Card className="texture-panel">
              <h3 className="text-lg font-bold">Переписка</h3>
              <div className="mt-4 space-y-3">
                {chatEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`rounded-[22px] p-4 text-sm leading-6 ${
                      entry.sender === 'client'
                        ? 'border border-border text-text-primary'
                        : entry.sender === 'manager'
                          ? 'bg-brand text-white'
                          : 'border border-dashed border-border text-text-secondary'
                    }`}
                    style={entry.sender === 'client' ? { background: 'color-mix(in srgb, var(--panel-bg-main) 92%, white 8%)' } : undefined}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">
                      {entry.sender === 'client' ? 'Клиент' : entry.sender === 'manager' ? 'Менеджер' : 'Система'}
                    </p>
                    <p className="mt-2">{entry.text}</p>
                    <p className={`mt-2 text-[11px] ${entry.sender === 'manager' ? 'text-white/80' : 'text-text-secondary/80'}`}>
                      {new Date(entry.created_at).toLocaleString('ru-RU')}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="texture-panel">
              <h3 className="text-lg font-bold">Ответ менеджера</h3>
              <div className="mt-4">
                <Textarea label="Текст ответа" value={reply} onChange={(event) => setReply(event.target.value)} className="min-h-28" />
              </div>
              <Button className="mt-4" loading={replying} onClick={() => void sendReply()}>Отправить в чат</Button>
            </Card>
          </div>
        )}
      </Drawer>
    </PageWrapper>
  );
}
