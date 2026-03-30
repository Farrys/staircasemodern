import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Images } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { supabase } from '@/lib/supabase';
import { finishAxis, modelAxis, railingAxis, readGalleryEmbeddedMeta, shapeAxis, stripGalleryEmbeddedMeta } from '@/lib/catalogContent';
import type { FinishType, GalleryItem, Material, RailingType, StairModel, StairShape } from '@/types';

const GALLERY_BUCKET = 'gallery';
const GALLERY_STORAGE_PREFIX = 'projects';

const initialForm = {
  title: '',
  category: 'wood' as Material,
  slug: '',
  is_featured: false,
  display_order: '0',
  stair_model: 'classic' as StairModel,
  stair_shape: 'straight' as StairShape,
  railing_type: 'wooden' as RailingType,
  finish_type: 'basic' as FinishType,
  description: '',
  price: '',
  image_url: '',
};

function sanitizeStorageFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .toLowerCase();
}

function extractGalleryStoragePath(imageUrl?: string | null) {
  if (!imageUrl) return null;

  try {
    const url = new URL(imageUrl);
    const marker = `/storage/v1/object/public/${GALLERY_BUCKET}/`;
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) return null;

    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) toast.error(error.message);
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setFile(null);
    setOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    const embeddedMeta = readGalleryEmbeddedMeta(item.description ?? '');

    setEditing(item);
    setForm({
      title: item.title,
      category: item.category,
      slug: item.slug ?? '',
      is_featured: item.is_featured ?? false,
      display_order: String(item.display_order ?? 0),
      stair_model: embeddedMeta.stair_model ?? 'classic',
      stair_shape: embeddedMeta.stair_shape ?? 'straight',
      railing_type: item.railing_type ?? embeddedMeta.railing_type ?? 'wooden',
      finish_type: item.finish_type ?? embeddedMeta.finish_type ?? 'basic',
      description: embeddedMeta.cleanDescription,
      price: item.price ? String(item.price) : '',
      image_url: item.image_url,
    });
    setFile(null);
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    let imageUrl = form.image_url;
    let uploadedStoragePath: string | null = null;
    const previousStoragePath = extractGalleryStoragePath(editing?.image_url);

    if (file) {
      const fileName = `${GALLERY_STORAGE_PREFIX}/${Date.now()}-${sanitizeStorageFileName(file.name)}`;
      const { error: uploadError } = await supabase.storage.from(GALLERY_BUCKET).upload(fileName, file, { upsert: true });
      if (uploadError) {
        setSaving(false);
        return toast.error(uploadError.message);
      }
      const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(fileName);
      uploadedStoragePath = fileName;
      imageUrl = data.publicUrl;
    }

    const payload = {
      title: form.title,
      category: form.category,
      slug: form.slug.trim() || null,
      is_featured: form.is_featured,
      display_order: Number(form.display_order) || 0,
      stair_model: form.stair_model,
      stair_shape: form.stair_shape,
      railing_type: form.railing_type,
      finish_type: form.finish_type,
      description: form.description || null,
      price: form.price ? Number(form.price) : null,
      image_url: imageUrl,
    };

    const query = editing ? supabase.from('gallery').update(payload).eq('id', editing.id) : supabase.from('gallery').insert(payload);
    const { error } = await query;

    if (error && uploadedStoragePath) {
      await supabase.storage.from(GALLERY_BUCKET).remove([uploadedStoragePath]);
    }

    setSaving(false);
    if (error) return toast.error(error.message);

    if (uploadedStoragePath && previousStoragePath && previousStoragePath !== uploadedStoragePath) {
      const { error: removeOldImageError } = await supabase.storage.from(GALLERY_BUCKET).remove([previousStoragePath]);
      if (removeOldImageError) {
        toast.error('Работа сохранена, но старое изображение не удалось удалить из Storage');
      }
    }

    toast.success(editing ? 'Работа обновлена' : 'Работа добавлена');
    setOpen(false);
    await load();
  };

  const remove = async (id: string) => {
    const item = items.find((entry) => entry.id === id);
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) return toast.error(error.message);

    const storagePath = extractGalleryStoragePath(item?.image_url);
    if (storagePath) {
      const { error: removeImageError } = await supabase.storage.from(GALLERY_BUCKET).remove([storagePath]);
      if (removeImageError) {
        toast.error('Запись удалена, но файл изображения остался в Storage');
      }
    }

    toast.success('Работа удалена');
    await load();
  };

  return (
    <PageWrapper>
      <div className="grid gap-8 lg:grid-cols-[260px,1fr]">
        <AdminSidebar />
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="eyebrow">кейсы и проекты</div>
              <h1 className="mt-5 text-3xl font-bold">Управление галереей</h1>
            </div>
            <Button onClick={openCreate}>Добавить работу</Button>
          </div>
          {loading ? <Spinner /> : items.length === 0 ? <EmptyState icon={Images} title="Работы в галерее не добавлены" action={<Button onClick={openCreate}>Добавить первую работу</Button>} /> : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <Card key={item.id} className="texture-panel overflow-hidden p-0">
                  <img src={item.image_url} alt={item.title} className="h-56 w-full object-cover" />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold">{item.title}</h3>
                      {item.is_featured && (
                        <span className="rounded-full bg-brand-light px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                          featured
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-text-secondary">{stripGalleryEmbeddedMeta(item.description || '') || 'Описание отсутствует'}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <span className="font-semibold text-brand">{item.price ? `${Number(item.price).toLocaleString('ru-RU')} ₸` : 'Цена по запросу'}</span>
                      <span className="text-text-secondary">Порядок: {item.display_order ?? 0}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <Button variant="outline" fullWidth onClick={() => openEdit(item)}>Редактировать</Button>
                      <Button variant="danger" fullWidth onClick={() => void remove(item.id)}>Удалить</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={open} title={editing ? 'Редактировать работу' : 'Добавить работу'} onClose={() => setOpen(false)} size="lg">
        <div className="space-y-4">
          <Input label="Название" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
          <div className="grid gap-4 md:grid-cols-[1fr,180px]">
            <Input
              label="Slug"
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="interior-staircase-mono"
            />
            <Input
              label="Порядок показа"
              type="number"
              value={form.display_order}
              onChange={(e) => setForm((prev) => ({ ...prev, display_order: e.target.value }))}
            />
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3 text-sm text-text-primary">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm((prev) => ({ ...prev, is_featured: e.target.checked }))}
            />
            Показывать в избранных кейсах
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-primary">Материал</span>
            <select
              className="w-full rounded-2xl border border-border px-4 py-3.5 text-text-primary outline-none transition focus:border-brand focus:ring-4"
              style={{
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                ['--tw-ring-color' as string]: 'color-mix(in srgb, rgb(var(--color-brand)) 24%, transparent)',
              }}
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as Material }))}
            >
              <option value="wood">Дерево</option>
              <option value="metal">Металл</option>
              <option value="glass">Стекло</option>
            </select>
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-text-primary">Конструкция</span>
              <select
                className="w-full rounded-2xl border border-border px-4 py-3.5 text-text-primary outline-none transition focus:border-brand focus:ring-4"
                style={{
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  ['--tw-ring-color' as string]: 'color-mix(in srgb, rgb(var(--color-brand)) 24%, transparent)',
                }}
                value={form.stair_model}
                onChange={(e) => setForm((prev) => ({ ...prev, stair_model: e.target.value as StairModel }))}
              >
                {modelAxis.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-text-primary">Форма</span>
              <select
                className="w-full rounded-2xl border border-border px-4 py-3.5 text-text-primary outline-none transition focus:border-brand focus:ring-4"
                style={{
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  ['--tw-ring-color' as string]: 'color-mix(in srgb, rgb(var(--color-brand)) 24%, transparent)',
                }}
                value={form.stair_shape}
                onChange={(e) => setForm((prev) => ({ ...prev, stair_shape: e.target.value as StairShape }))}
              >
                {shapeAxis.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-text-primary">Ограждение</span>
              <select
                className="w-full rounded-2xl border border-border px-4 py-3.5 text-text-primary outline-none transition focus:border-brand focus:ring-4"
                style={{
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  ['--tw-ring-color' as string]: 'color-mix(in srgb, rgb(var(--color-brand)) 24%, transparent)',
                }}
                value={form.railing_type}
                onChange={(e) => setForm((prev) => ({ ...prev, railing_type: e.target.value as RailingType }))}
              >
                {railingAxis.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-text-primary">Отделка</span>
              <select
                className="w-full rounded-2xl border border-border px-4 py-3.5 text-text-primary outline-none transition focus:border-brand focus:ring-4"
                style={{
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  ['--tw-ring-color' as string]: 'color-mix(in srgb, rgb(var(--color-brand)) 24%, transparent)',
                }}
                value={form.finish_type}
                onChange={(e) => setForm((prev) => ({ ...prev, finish_type: e.target.value as FinishType }))}
              >
                {finishAxis.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="text-xs leading-6 text-text-secondary">
            Материал, конструкция, форма, ограждение и отделка помогают точнее описать проект и упростить фильтрацию в галерее.
          </p>
          <Textarea label="Описание" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
          <Input label="Цена" type="number" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} />
          <Input label="URL изображения" value={form.image_url} onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))} />
          <label className="block space-y-2">
            <span className="text-sm font-medium">Загрузка файла в Supabase Storage</span>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
          <Button loading={saving} onClick={() => void save()}>{editing ? 'Сохранить' : 'Добавить'}</Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
