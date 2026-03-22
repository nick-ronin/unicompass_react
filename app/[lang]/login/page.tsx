'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Button from '@/components/Button';
import InputField from '@/components/Input Field';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const currentLang = segments[0] || 'ru';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translations = {
    ru: {
      title: 'Вход',
      username: 'Имя пользователя',
      password: 'Пароль',
      loginBtn: 'Войти',
      register: 'Зарегистрироваться',
      forgotPassword: 'Забыли пароль?',
      loginError: 'Ошибка входа',
      fillAllFields: 'Введите имя пользователя и пароль',
    },
    en: {
      title: 'Sign In',
      username: 'Username',
      password: 'Password',
      loginBtn: 'Sign In',
      register: 'Sign Up',
      forgotPassword: 'Forgot password?',
      loginError: 'Login error',
      fillAllFields: 'Please fill in username and password',
    },
  };

  const t = translations[currentLang as keyof typeof translations] || translations.ru;

  const extractErrorMessage = (errorData: unknown): string | null => {
    if (!errorData) return null;

    if (typeof errorData === 'string') {
      return errorData;
    }

    if (Array.isArray(errorData)) {
      const messages = errorData
        .map((item) => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object') {
            const obj = item as { msg?: unknown; detail?: unknown };
            if (typeof obj.msg === 'string') return obj.msg;
            if (typeof obj.detail === 'string') return obj.detail;
          }
          return null;
        })
        .filter((msg): msg is string => Boolean(msg));

      return messages.length ? messages.join(', ') : null;
    }

    if (typeof errorData === 'object') {
      const obj = errorData as { message?: unknown; detail?: unknown; msg?: unknown };
      if (typeof obj.message === 'string') return obj.message;
      if (typeof obj.msg === 'string') return obj.msg;
      return extractErrorMessage(obj.detail);
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError(t.fillAllFields);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const normalizedUsername = username.trim();
      const payloadVariants: Array<{
        body: string;
        headers: Record<string, string>;
      }> = [
        {
          body: JSON.stringify({ username: normalizedUsername, password }),
          headers: { 'Content-Type': 'application/json' },
        },
        {
          body: JSON.stringify({ login: normalizedUsername, password }),
          headers: { 'Content-Type': 'application/json' },
        },
        {
          body: new URLSearchParams({ username: normalizedUsername, password }).toString(),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
        {
          body: new URLSearchParams({ login: normalizedUsername, password }).toString(),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      ];

      let lastErrorMessage = `${t.loginError}`;
      let isLoggedIn = false;
      let loginResponseData: any = null;

      for (const variant of payloadVariants) {
        const response = await fetch('/api/student/login', {
          method: 'POST',
          headers: variant.headers,
          body: variant.body,
        });

        if (response.ok) {
          loginResponseData = await response.json().catch(() => null);
          isLoggedIn = true;
          break;
        }

        const errorData = await response.json().catch(() => ({}));
        const message = extractErrorMessage(errorData) || `${t.loginError}: ${response.status}`;
        lastErrorMessage = message;

        const isValidationError = response.status === 422;
        const hasMissingFields = /field required/i.test(message);
        if (!(isValidationError && hasMissingFields)) {
          break;
        }
      }

      if (!isLoggedIn) {
        throw new Error(lastErrorMessage);
      }

      const studentId =
        loginResponseData?.student_id ??
        loginResponseData?.studentId ??
        loginResponseData?.id ??
        loginResponseData?.student?.id ??
        loginResponseData?.user?.id;

      localStorage.setItem(
        'studentAuth',
        JSON.stringify({
          username: normalizedUsername,
          studentId: studentId ? String(studentId) : null,
        })
      );

      router.push(`/${currentLang}/student`);
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : t.loginError);
      setLoading(false);
    }
  };

  const switchLanguage = () => {
    const nextLang = currentLang === 'ru' ? 'en' : 'ru';
    const newSegments = segments.map((s, i) => (i === 0 ? nextLang : s));
    router.push('/' + newSegments.join('/'));
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-dark-gray'>
      {/* Login Form Container */}
      <div className='w-full max-w-md bg-white rounded-3xl shadow-lg p-16'>
        <div>
          {/* Header with Language Toggle */}
          <div className='flex items-center justify-between gap-4 mb-8'>
            <h1 className='text-3xl flex-1 text-black'>
              {t.title}
            </h1>
            <button
              onClick={switchLanguage}
              className='flex items-center justify-center gap-2 bg-cyan text-white px-4 py-3 rounded-2xl hover:bg-dark-cyan transition-colors duration-200 cursor-pointer whitespace-nowrap'
              aria-label={`Switch to ${currentLang === 'ru' ? 'English' : 'Russian'}`}
            >
              <span className='material-symbols-outlined text-lg'>language</span>
              <span className='text-base font-medium'>{currentLang.toUpperCase()}</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Error Message */}
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm'>
                {error}
              </div>
            )}

            {/* Username Field */}
            <div>
              <label className='block text-base font-medium text-dark-gray mb-2'>
                {t.username}
              </label>
              <InputField
                type='text'
                placeholder='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disableDarkTheme
                icon={<span className='material-symbols-outlined'>account_circle</span>}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className='block text-base font-medium text-dark-gray mb-2'>
                {t.password}
              </label>
              <InputField
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disableDarkTheme
                icon={<span className='material-symbols-outlined'>lock</span>}
              />
            </div>

            {/* Submit Button */}
            <Button
              type='submit'
              className='w-full bg-orange text-white font-semibold py-4 text-lg hover:bg-dark-orange transition-colors duration-200 justify-center'
            >
              {loading ? '...' : t.loginBtn}
            </Button>
          </form>

          {/* Divider */}
          <div className='my-6 flex items-center gap-3'>
            <div className='flex-1 h-px bg-medium-blue-gray'></div>
            <span className='text-base text-medium-blue-gray'>or</span>
            <div className='flex-1 h-px bg-medium-blue-gray'></div>
          </div>

          {/* Footer Links */}
          <div className='space-y-3'>
            <p className='text-center text-base text-dark-gray'>
              <Link
                href={`/${currentLang}/register`}
                className='text-cyan hover:text-dark-cyan font-semibold transition-colors'
              >
                {t.register}
              </Link>
            </p>
            <p className='text-center text-base'>
              <Link
                href={`/${currentLang}/forgot-password`}
                className='text-orange hover:text-dark-orange font-semibold transition-colors'
              >
                {t.forgotPassword}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
