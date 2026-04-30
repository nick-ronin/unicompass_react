'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import NotificationsBell from './NotificationsBell';

interface HeaderProps {
  lang?: string;
  role?: string;
}

const navigationCopy = {
  ru: {
    home: 'Главная',
    tables: 'Таблицы',
    analytics: 'Аналитика',
    tasks: 'Задачи',
    chat: 'Чат',
    calendar: 'Календарь',
    knowledgeBase: 'База знаний',
    documents: 'Документы',
  },
  en: {
    home: 'Home',
    tables: 'Tables',
    analytics: 'Analytics',
    tasks: 'Tasks',
    chat: 'Chat',
    calendar: 'Calendar',
    knowledgeBase: 'Knowledge base',
    documents: 'Documents',
  },
};

export default function Header({ lang = 'ru', role = 'student' }: HeaderProps) {
  const t = navigationCopy[(lang as keyof typeof navigationCopy) ?? 'ru'] || navigationCopy.ru;
  const base = `/${lang}/${role}`;
  const pathname = usePathname();
  const isProfilePage = pathname === `${base}/profile`;
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const storedAvatar = typeof window !== 'undefined' ? localStorage.getItem('studentAvatarUrl') : null;
    if (storedAvatar) setAvatarUrl(storedAvatar);

    const pickAvatarUrl = (data: any) => data?.file_url || data?.file_path || data?.url || null;

    const fetchAvatar = async () => {
      if (role !== 'student') return;

      const storedAuthRaw = typeof window !== 'undefined' ? localStorage.getItem('studentAuth') : null;
      if (!storedAuthRaw) return;

      try {
        const storedAuth = JSON.parse(storedAuthRaw);
        const studentId = storedAuth?.studentId;
        if (!studentId) return;

        const res = await fetch(`/api/files/avatar/${studentId}`);
        if (!res.ok) {
          if (res.status === 404) {
            localStorage.removeItem('studentAvatarUrl');
            setAvatarUrl(null);
          }
          return;
        }

        const data = await res.json().catch(() => ({}));
        const url = pickAvatarUrl(data);
        if (url) {
          setAvatarUrl(url);
          localStorage.setItem('studentAvatarUrl', url);
        }
      } catch (err) {
        console.warn('Avatar resolve skipped', err);
      }
    };

    fetchAvatar();
  }, [role]);

  const isDark = mounted && resolvedTheme === 'dark';
  const aLogoSrc = isDark ? '/logo/a+white.png' : '/logo/a+black.png';
  const rosmolLogoSrc = isDark ? '/rosmol-white.png' : '/rosmol-black.png';

  const navigationLinks = role === 'admin' 
    ? [
        { label: t.home, href: base },
        { label: t.tables, href: `${base}/tables` },
        { label: t.analytics, href: `${base}/analytics` },
        { label: t.tasks, href: `${base}/tasks` },
        { label: t.knowledgeBase, href: `${base}/knowledge-base` },
        { label: t.documents, href: `${base}/documents` },
        { label: t.chat, href: `${base}/chat` },
      ]
    : [
        { label: t.home, href: base },
        { label: t.calendar, href: `${base}/calendar` },
        { label: t.documents, href: `${base}/documents` },
        { label: t.knowledgeBase, href: `${base}/knowledge-base` },
        { label: t.tasks, href: `${base}/tasks` },
        { label: t.chat, href: `${base}/chat` },
      ];

  return (
    <header className='bg-white px-4 py-3 text-black dark:bg-surface dark:text-white md:px-12 md:py-4'>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex min-w-0 items-center gap-3 md:gap-11'>
            <Link href={base} className='shrink-0'>
              <Image src={aLogoSrc} alt='A+ Logo' width={120} height={40} className='h-4 w-auto md:h-6' />
            </Link>
            <Link href='https://fadm.gov.ru/directions/grant/' className='hidden shrink-0 sm:block'>
              <Image src={rosmolLogoSrc} alt='Rosmol Logo' width={120} height={40} className='h-14 w-auto md:h-16' />
            </Link>
            <div className='hidden md:block h-8 w-px bg-medium-blue-gray'></div>
            <div className='hidden md:flex flex-row items-center gap-8 text-xl'>
              {navigationLinks.map((link) => (
                <Link key={link.label} className='transition-colors hover:text-dark-orange' href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className='flex items-center gap-2 sm:gap-3 md:gap-6'>
            <ThemeToggle lang={lang} />
            <NotificationsBell lang={lang} role={role} />
            <LanguageToggle />
            <Link 
              href={`${base}/profile`}
              className={cn(
                'transition-colors',
                isProfilePage 
                  ? 'text-dark-gray' 
                  : 'text-orange hover:text-dark-orange'
              )}
            >
              <div className='relative h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12'>
                <Image
                  src={avatarUrl || '/NoAvatarDefault.svg'}
                  alt='Profile avatar'
                  fill
                  sizes='48px'
                  className='rounded-full object-cover border-2 border-current'
                  unoptimized
                />
              </div>
            </Link>
          </div>
        </div>

        <nav className='flex gap-2 overflow-x-auto pb-1 md:hidden'>
          {navigationLinks.map((link) => (
            <Link
              key={link.label}
              className='whitespace-nowrap rounded-full border border-light-blue-gray px-3 py-2 text-sm text-dark-gray transition-colors hover:border-dark-orange hover:text-dark-orange dark:border-dark-gray dark:text-white'
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}