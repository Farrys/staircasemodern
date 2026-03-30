import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Wrench } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { supabase } from '@/lib/supabase';
import type { Service } from '@/types';

const emptyService = { name: '', description: '', price_from: '' };

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyService);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('services').select('*').order('name');
    if (error) toast.error(error.message);
    setServices(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const updateField = async (id: string, payload: Partial<Service>) => {
    const { error } = await supabase.from('services').update(payload).eq('id', id);
    if (error) return toast.error(error.message);
    await load();
  };

  const addService = async () => {
    setSaving(true);
    const { error } = await supabase.from('services').insert({
      name: form.name,
      description: form.description,
      price_from: form.price_from ? Number(form.price_from) : null,
      is_active: true,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success('Услуга добавлена');
    setOpen(false);
    setForm(emptyService);
    await load();
  };

  return (
    <PageWrapper>
      <div className="grid gap-8 lg:grid-cols-[260px,1fr]">
        <AdminSidebar />
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="eyebrow">услуги студии</div>
              <h1 className="mt-5 text-3xl font-bold">Управление услугами</h1>
            </div>
            <Button onClick={() => setOpen(true)}>Добавить услугу</Button>
          </div>
          {loading ? <Spinner /> : services.length === 0 ? <EmptyState icon={Wrench} title="Услуги пока не добавлены" /> : (
            <div className="glass-panel warm-ring overflow-x-auto rounded-[28px]">
              <table className="min-w-full text-sm">
                <thead className="bg-brand-light text-left text-text-secondary">
                  <tr>
                    <th className="px-4 py-3 font-medium">Название</th>
                    <th className="px-4 py-3 font-medium">Описание</th>
                    <th className="px-4 py-3 font-medium">Цена от</th>
                    <th className="px-4 py-3 font-medium">Активна</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id} className="border-t border-border align-top">
                      <td className="px-4 py-4"><input defaultValue={service.name} className="w-full rounded-xl border border-border px-3 py-2 text-text-primary" style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 90%, white 10%)' }} onBlur={(e) => void updateField(service.id, { name: e.target.value })} /></td>
                      <td className="px-4 py-4"><textarea defaultValue={service.description ?? ''} className="min-h-24 w-full rounded-xl border border-border px-3 py-2 text-text-primary" style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 90%, white 10%)' }} onBlur={(e) => void updateField(service.id, { description: e.target.value })} /></td>
                      <td className="px-4 py-4"><input type="number" defaultValue={service.price_from ?? ''} className="w-40 rounded-xl border border-border px-3 py-2 text-text-primary" style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 90%, white 10%)' }} onBlur={(e) => void updateField(service.id, { price_from: e.target.value ? Number(e.target.value) : null })} /></td>
                      <td className="px-4 py-4"><input type="checkbox" checked={service.is_active} onChange={(e) => void updateField(service.id, { is_active: e.target.checked })} className="h-5 w-5 accent-brand" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal open={open} title="Добавить услугу" onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Input label="Название" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
          <Input label="Описание" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
          <Input label="Цена от" type="number" value={form.price_from} onChange={(e) => setForm((prev) => ({ ...prev, price_from: e.target.value }))} />
          <Button loading={saving} onClick={() => void addService()}>Добавить</Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
