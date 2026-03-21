'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface HeaderProps {
  lang?: string;
  role?: string;
}

export default function Header({ lang = 'ru', role = 'student' }: HeaderProps) {
  const base = `/${lang}/${role}`;
  const pathname = usePathname();
  const isProfilePage = pathname === `${base}/profile`;

  const navigationLinks = role === 'admin' 
    ? [
        { label: 'Главная', href: base },
        { label: 'Таблицы', href: `${base}/tables` },
        { label: 'Аналитика', href: `${base}/analytics` },
        { label: 'Задачи', href: `${base}/tasks` },
        { label: 'Чат', href: `${base}/chat` },
      ]
    : [
        { label: 'Главная', href: base },
        { label: 'Календарь', href: `${base}/calendar` },
        { label: 'База знаний', href: `${base}/knowledge-base` },
        { label: 'Задачи', href: `${base}/tasks` },
        { label: 'Чат', href: `${base}/chat` },
      ];

  return (
    <header className='py-4 px-12 bg-white dark:bg-surface text-black dark:text-white flex flex-row justify-between items-center'>
      <div className='flex gap-11 flex-row items-center text-xl'>
        <Link href={base}>
          <Image src='/logo/a+.png' alt='A+ Logo' width={120} height={40} />
        </Link>
        <div className='inline-block h-8 w-px bg-medium-blue-gray'></div>
        {navigationLinks.map((link) => (
          <Link key={link.label} className='hover:text-dark-orange' href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
      <div className='flex gap-6 justify-end items-center'>
        <ThemeToggle />
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
          <svg width="52" height="53" viewBox="0 0 52 53" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="26" cy="26" r="24.5" stroke="currentColor" strokeWidth="3"/>
            <path d="M15.5713 36.5402V48.7668C15.5713 48.7668 17.7959 51.6779 25.8601 51.6779C33.9242 51.6779 36.4269 48.7668 36.4269 48.7668V36.5402C36.4269 33.0469 34.8975 26.9336 25.8601 26.9336C16.8226 26.9336 15.5713 33.1925 15.5713 36.5402Z" fill="currentColor" stroke="currentColor"/>
            <path d="M26.1396 12.2965C29.5279 12.2965 32.3133 15.1787 32.3135 18.7828C32.3135 22.3871 29.528 25.2701 26.1396 25.2701C22.7513 25.2701 19.9658 22.3871 19.9658 18.7828C19.966 15.1787 22.7514 12.2965 26.1396 12.2965Z" fill="currentColor" stroke="currentColor"/>
          </svg>
        </Link>
      </div>
    </header>
  );
}