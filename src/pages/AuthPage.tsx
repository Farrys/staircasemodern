import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { KeyRound, ShieldCheck, Sparkles } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { isEmail, minLength } from '@/lib/validators';

type Tab = 'login' | 'register';

function getAuthErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes('email rate limit exceeded')) {
    return 'Лимит отправки писем подтверждения исчерпан. Подождите немного и попробуйте снова, либо отключите email confirmation в настройках Supabase Auth.';
  }

  if (normalized.includes('user already registered')) {
    return 'Пользователь с таким email уже зарегистрирован. Попробуйте войти.';
  }

  return message;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const [tab, setTab] = useState<Tab>('login');
  const [login, setLogin] = useState({ email: '', password: '' });
  const [register, setRegister] = useState({ full_name: '', email: '', password: '', passwordConfirm: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      const pending = sessionStorage.getItem('pendingOrderParams');
      if (pending) {
        const parsed = JSON.parse(pending);
        sessionStorage.removeItem('pendingOrderParams');
        navigate('/orders/new', { state: parsed });
        return;
      }
      navigate((location.state as { from?: string } | null)?.from ?? '/profile');
    }
  }, [location.state, navigate, session]);

  const signIn = async () => {
    if (!isEmail(login.email) || !minLength(login.password, 6)) {
      toast.error('Введите корректные email и пароль');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(login);
    setLoading(false);
    if (error) return toast.error(getAuthErrorMessage(error.message));
    toast.success('Вход выполнен');
  };

  const signUp = async () => {
    if (!minLength(register.full_name, 2) || !isEmail(register.email)) return toast.error('Проверьте введённые данные');
    if (register.password !== register.passwordConfirm) return toast.error('Пароли не совпадают');
    if (!minLength(register.password, 6)) return toast.error('Пароль должен быть не короче 6 символов');

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: register.email,
      password: register.password,
      options: {
        data: { full_name: register.full_name },
      },
    });
    setLoading(false);
    if (error) return toast.error(getAuthErrorMessage(error.message));
    toast.success('Регистрация выполнена. Подтвердите email.');
    setTab('login');
  };

  return (
    <PageWrapper>
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.92fr,1.08fr]">
        <Card className="texture-panel">
          <div className="eyebrow">
            <Sparkles className="h-4 w-4" />
            доступ к личному кабинету
          </div>
          <h1 className="mt-5 font-['Cormorant_Garamond'] text-5xl font-bold leading-none">Вход и регистрация без лишней путаницы</h1>
          <div className="mt-6 space-y-4 text-sm leading-7 text-text-secondary">
            <p>После входа пользователь попадает в кабинет, где может сохранить профиль, оформить заказ на основе калькулятора и отслеживать все статусы проекта.</p>
            <p>Если подтверждение почты включено, интерфейс уже готов к этому сценарию и корректно обрабатывает ошибки Supabase.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div
              className="rounded-[24px] p-4"
              style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 88%, white 12%)' }}
            >
              <ShieldCheck className="h-6 w-6 text-brand" />
              <p className="mt-3 font-semibold">Безопасная авторизация</p>
              <p className="mt-2 text-sm text-text-secondary">Поддержка подтверждения email и типовых сценариев входа через Supabase Auth.</p>
            </div>
            <div
              className="rounded-[24px] p-4"
              style={{ background: 'color-mix(in srgb, var(--panel-bg-main) 88%, white 12%)' }}
            >
              <KeyRound className="h-6 w-6 text-brand" />
              <p className="mt-3 font-semibold">Плавный маршрут</p>
              <p className="mt-2 text-sm text-text-secondary">Если пользователь пришёл из калькулятора, выбранные параметры не теряются.</p>
            </div>
          </div>
        </Card>
        <Card className="mx-auto w-full max-w-md">
          <div className="mb-6 flex rounded-2xl bg-brand-light p-1">
            <button
              className={`flex-1 rounded-xl px-4 py-2 text-text-primary ${tab === 'login' ? 'shadow' : 'text-text-secondary'}`}
              style={tab === 'login' ? { background: 'color-mix(in srgb, var(--panel-bg-main) 30%, white 70%)' } : undefined}
              onClick={() => setTab('login')}
            >
              Вход
            </button>
            <button
              className={`flex-1 rounded-xl px-4 py-2 text-text-primary ${tab === 'register' ? 'shadow' : 'text-text-secondary'}`}
              style={tab === 'register' ? { background: 'color-mix(in srgb, var(--panel-bg-main) 30%, white 70%)' } : undefined}
              onClick={() => setTab('register')}
            >
              Регистрация
            </button>
          </div>
          {tab === 'login' ? (
            <div className="space-y-4">
              <Input label="Email" type="email" value={login.email} onChange={(e) => setLogin((prev) => ({ ...prev, email: e.target.value }))} />
              <Input label="Пароль" type="password" value={login.password} onChange={(e) => setLogin((prev) => ({ ...prev, password: e.target.value }))} />
              <Button fullWidth loading={loading} onClick={() => void signIn()}>Войти</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input label="Имя" value={register.full_name} onChange={(e) => setRegister((prev) => ({ ...prev, full_name: e.target.value }))} />
              <Input label="Email" type="email" value={register.email} onChange={(e) => setRegister((prev) => ({ ...prev, email: e.target.value }))} />
              <Input label="Пароль" type="password" value={register.password} onChange={(e) => setRegister((prev) => ({ ...prev, password: e.target.value }))} />
              <Input label="Подтверждение пароля" type="password" value={register.passwordConfirm} onChange={(e) => setRegister((prev) => ({ ...prev, passwordConfirm: e.target.value }))} />
              <Button fullWidth loading={loading} onClick={() => void signUp()}>Зарегистрироваться</Button>
            </div>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
}
