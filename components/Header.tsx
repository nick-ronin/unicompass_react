import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

interface HeaderProps {
  lang?: string;
  role?: string;
}

export default function Header({ lang = 'ru', role = 'student' }: HeaderProps) {
  const base = `/${lang}/${role}`;

  return (
    <header className='py-4 px-12 bg-white dark:bg-surface text-black dark:text-white flex flex-row justify-between items-center'>
      <div className='flex gap-11 flex-row items-center text-xl'>
        <Link href={base}><Image src='/logo/Logo.svg' width={95} height={40} alt='UniCompass logo'/></Link>
        <div className='inline-block h-8 w-px bg-gray-400'></div>
        <Link className='hover:text-dark-orange' href={base}>Главная</Link>
        <Link className='hover:text-dark-orange' href={`${base}/calendar`}>Календарь</Link>
        <Link className='hover:text-dark-orange' href={`${base}/knowledge-base`}>База знаний</Link>
        <Link className='hover:text-dark-orange' href={`${base}/tasks`}>Задачи</Link>
        <Link className='hover:text-dark-orange' href={`${base}/chat`}>Чат</Link>
      </div>
      <div className='flex gap-6 justify-end items-center'>
        <ThemeToggle />
        <Link className='hover:text-dark-orange flex items-center' href={`${base}/notifications`}><span className='icon'>notifications</span></Link>
        <LanguageToggle />
        <Link href={`${base}/profile`}><Image className='hover:stroke-black hover:fill-black' src='/NoAvatarDefault.svg' width={52} height={52} alt='No Avatar'/></Link>
      </div>
    </header>
  );
}