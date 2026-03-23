'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

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
  },
  en: {
    home: 'Home',
    tables: 'Tables',
    analytics: 'Analytics',
    tasks: 'Tasks',
    chat: 'Chat',
    calendar: 'Calendar',
    knowledgeBase: 'Knowledge base',
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
    if (storedAvatar) {
      setAvatarUrl(storedAvatar);
      return;
    }

    const storedAuthRaw = typeof window !== 'undefined' ? localStorage.getItem('studentAuth') : null;
    if (!storedAuthRaw || role !== 'student') return;

    try {
      const storedAuth = JSON.parse(storedAuthRaw);
      const studentId = storedAuth?.studentId;
      if (!studentId) return;

      fetch(`/api/files/upload-avatar/${studentId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          const url = data?.file_url || data?.url || null;
          if (url) {
            setAvatarUrl(url);
            localStorage.setItem('studentAvatarUrl', url);
          }
        })
        .catch(() => {});
    } catch (err) {
      console.warn('Avatar resolve skipped', err);
    }
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
        { label: t.chat, href: `${base}/chat` },
      ]
    : [
        { label: t.home, href: base },
        { label: t.calendar, href: `${base}/calendar` },
        { label: t.knowledgeBase, href: `${base}/knowledge-base` },
        { label: t.tasks, href: `${base}/tasks` },
        { label: t.chat, href: `${base}/chat` },
      ];

  return (
    <header className='py-4 px-12 bg-white dark:bg-surface text-black dark:text-white flex flex-row justify-between items-center'>
      <div className='flex gap-11 flex-row items-center text-xl'>
        <Link href={base}>
          <Image src={aLogoSrc} alt='A+ Logo' width={120} height={40} />
        </Link>
        <Link href='https://fadm.gov.ru/directions/grant/'>
          <Image src={rosmolLogoSrc} alt='Rosmol Logo' width={120} height={40} />
        </Link>
        <div className='inline-block h-8 w-px bg-medium-blue-gray'></div>
        {navigationLinks.map((link) => (
          <Link key={link.label} className='hover:text-dark-orange' href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
      <div className='flex gap-6 justify-end items-center'>
        <ThemeToggle lang={lang} />
        <Link className='hover:text-dark-orange flex items-center' href={`${base}/notifications`}><span className='material-symbols-outlined'>notifications</span></Link>
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
          <div className='relative w-12 h-12'>
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
    </header>
  );
}