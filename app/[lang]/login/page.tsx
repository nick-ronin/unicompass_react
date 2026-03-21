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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const translations = {
    ru: {
      title: 'Войти на сайт',
      email: 'Электронная почта',
      password: 'Пароль',
      loginBtn: 'Войти',
      register: 'Зарегистрироваться',
      forgotPassword: 'Забыли пароль?',
    },
    en: {
      title: 'Sign In',
      email: 'Email',
      password: 'Password',
      loginBtn: 'Sign In',
      register: 'Sign Up',
      forgotPassword: 'Forgot password?',
    },
  };

  const t = translations[currentLang as keyof typeof translations] || translations.ru;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement login logic
    setTimeout(() => setLoading(false), 1000);
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
            {/* Email Field */}
            <div>
              <label className='block text-base font-medium text-dark-gray mb-2'>
                {t.email}
              </label>
              <InputField
                type='email'
                placeholder='example@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disableDarkTheme
                icon={<span className='material-symbols-outlined'>mail</span>}
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
            <span className='text-base text-medium-blue-gray'>или</span>
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
