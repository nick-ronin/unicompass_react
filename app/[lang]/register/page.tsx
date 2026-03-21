'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Button from '@/components/Button';
import InputField from '@/components/Input Field';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const currentLang = segments[0] || 'ru';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [citizenship, setCitizenship] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translations = {
    ru: {
      title: 'Регистрация',
      firstName: 'Имя',
      lastName: 'Фамилия',
      patronymic: 'Отчество (необязательно)',
      citizenship: 'Гражданство',
      login: 'Логин',
      password: 'Пароль',
      passwordConfirm: 'Повторите пароль',
      agreeTermsText: 'Я согласен на обработку персональных данных',
      registerBtn: 'Зарегистрироваться',
      alreadyRegistered: 'Уже зарегистрированы?',
      loginLink: 'Войти',
      loginGosuslugi: 'Войти через Госуслуги',
      passwordMismatch: 'Пароли не совпадают',
      agreeTerms: 'Вы должны согласиться с обработкой персональных данных',
      registrationError: 'Ошибка при регистрации',
      fillAllFields: 'Заполните все обязательные поля',
    },
    en: {
      title: 'Sign Up',
      firstName: 'First Name',
      lastName: 'Last Name',
      patronymic: 'Patronymic (optional)',
      citizenship: 'Citizenship',
      login: 'Username',
      password: 'Password',
      passwordConfirm: 'Confirm Password',
      agreeTermsText: 'I agree to the processing of personal data',
      registerBtn: 'Sign Up',
      alreadyRegistered: 'Already have an account?',
      loginLink: 'Sign In',
      loginGosuslugi: 'Sign in via Gosuslugi',
      passwordMismatch: 'Passwords do not match',
      agreeTerms: 'You must agree to the processing of personal data',
      registrationError: 'Registration error',
      fillAllFields: 'Please fill in all required fields',
    },
  };

  const t = translations[currentLang as keyof typeof translations] || translations.ru;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!firstName.trim() || !lastName.trim() || !citizenship.trim() || !login.trim() || !password.trim()) {
      setError(t.fillAllFields);
      return;
    }

    // Validate passwords match
    if (password !== passwordConfirm) {
      setError(t.passwordMismatch);
      return;
    }

    if (!agreedToTerms) {
      setError(t.agreeTerms);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://159.194.196.47:8000/student/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          patronymic: patronymic.trim() || '',
          citizenship: citizenship.trim(),
          login: login.trim(),
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `${t.registrationError}: ${response.status}`);
      }

      const data = await response.json();
      
      // Redirect to student home page
      router.push(`/${currentLang}/student`);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : t.registrationError);
      setLoading(false);
    }
  };

  const switchLanguage = () => {
    const nextLang = currentLang === 'ru' ? 'en' : 'ru';
    const newSegments = segments.map((s, i) => (i === 0 ? nextLang : s));
    router.push('/' + newSegments.join('/'));
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4 py-8 bg-dark-gray'>
      {/* Register Form Container */}
      <div className='w-full max-w-lg bg-white rounded-3xl px-12 py-8'>
          {/* Header with Language Toggle */}
          <div className='flex items-center justify-between gap-2 mb-8'>
            <h1 className='text-4xl font-bold text-dark-gray flex-1'>
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
          <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4 items-end'>
            {/* Error Message */}
            {error && (
              <div className='col-span-2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm'>
                {error}
              </div>
            )}
            {/* First Name Field */}
            <div>
              <label className='block text-base font-medium text-dark-gray mb-2'>
                {t.firstName}
              </label>
              <InputField
                type='text'
                placeholder='Иван'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disableDarkTheme
                icon={<span className='material-symbols-outlined'>person</span>}
              />
            </div>

            {/* Last Name Field */}
            <div>
              <label className='block text-base font-medium text-dark-gray mb-2'>
                {t.lastName}
              </label>
              <InputField
                type='text'
                placeholder='Иванов'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disableDarkTheme
                icon={<span className='material-symbols-outlined'>person</span>}
              />
            </div>

            {/* Patronymic Field (Optional) */}
            <div>
              <label className='block text-base font-medium text-dark-gray mb-2'>
                {t.patronymic}
              </label>
              <InputField
                type='text'
                placeholder='Иванович'
                value={patronymic}
                disableDarkTheme
                onChange={(e) => setPatronymic(e.target.value)}
                icon={<span className='material-symbols-outlined'>person</span>}
              />
            </div>

            {/* Citizenship Field */}
            <div>
              <label className='block text-base font-medium text-dark-gray mb-2'>
                {t.citizenship}
              </label>
              <InputField
                type='text'
                placeholder='Россия'
                value={citizenship}
                disableDarkTheme
                onChange={(e) => setCitizenship(e.target.value)}
                required
                icon={<span className='material-symbols-outlined'>public</span>}
              />
            </div>

            {/* Login Field */}
            <div>
              <label className='block text-base font-medium text-dark-gray mb-2'>
                {t.login}
              </label>
              <InputField
                type='text'
                placeholder='username'
                value={login}
                disableDarkTheme
                onChange={(e) => setLogin(e.target.value)}
                required
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
                disableDarkTheme
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<span className='material-symbols-outlined'>lock</span>}
              />
            </div>

            {/* Password Confirm Field */}
            <div>
              <label className='block text-base font-medium text-dark-gray mb-2'>
                {t.passwordConfirm}
              </label>
              <InputField
                type='password'
                placeholder='••••••••'
                disableDarkTheme
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                icon={<span className='material-symbols-outlined'>lock</span>}
              />
            </div>

            {/* Terms Checkbox */}
            <div className='col-span-2 flex items-center gap-3 my-4'>
              <input
                type='checkbox'
                id='terms'
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className='w-5 h-5 cursor-pointer accent-cyan'
              />
              <label htmlFor='terms' className='text-base text-dark-gray cursor-pointer'>
                {t.agreeTermsText}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='col-span-2 w-full bg-orange text-white font-semibold py-4 text-lg hover:bg-dark-orange transition-colors duration-200 rounded-2xl cursor-pointer justify-center flex items-center'
            >
              {loading ? '...' : t.registerBtn}
            </button>
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
              <span>{t.alreadyRegistered} </span>
              <Link
                href={`/${currentLang}/login`}
                className='text-cyan hover:text-dark-cyan font-semibold transition-colors'
              >
                {t.loginLink}
              </Link>
            </p>
            <p className='text-center'>
              <Link
                href={`/${currentLang}/login-gosuslugi`}
                className='text-orange hover:text-dark-orange font-semibold transition-colors text-base'
              >
                {t.loginGosuslugi}
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
}
