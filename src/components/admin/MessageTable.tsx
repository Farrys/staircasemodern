import { Mail, Phone } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Message } from '@/types';

export function MessageTable({
  messages,
  onMarkProcessed,
}: {
  messages: Message[];
  onMarkProcessed: (message: Message) => void;
}) {
  return (
    <div className="grid gap-4">
      {messages.map((message) => (
        <Card key={message.id} className="texture-panel">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-bold">{message.name}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${message.is_processed ? 'bg-[#dce8d8] text-[#31543a]' : 'bg-[#f8e7bf] text-[#78581c]'}`}>
                  {message.is_processed ? 'Обработано' : 'Не обработано'}
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-2 text-sm text-text-secondary">
                <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> {message.email}</span>
                {message.phone && <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> {message.phone}</span>}
                <span>{new Date(message.created_at).toLocaleString('ru-RU')}</span>
              </div>
              <p className="mt-4 text-sm text-text-secondary">{message.text}</p>
            </div>
            {!message.is_processed && <Button onClick={() => onMarkProcessed(message)}>Отметить как обработанное</Button>}
          </div>
        </Card>
      ))}
    </div>
  );
}
