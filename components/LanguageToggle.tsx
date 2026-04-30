'use client';

import { usePathname, useRouter } from 'next/navigation';
import MaterialIcon from '@/components/MaterialIcon';

const LANGUAGES: { code: string; label: string }[] = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
];

export default function LanguageToggle() {
  const pathname = usePathname();
  const router = useRouter();

  // URL structure: /[lang]/[role]/...
  // Extract current lang from the first segment
  const segments = pathname.split('/').filter(Boolean); // e.g. ['ru', 'student', 'calendar']
  const currentLang = segments[0] || 'ru';

  const currentIndex = LANGUAGES.findIndex((l) => l.code === currentLang);
  const nextLang = LANGUAGES[(currentIndex + 1) % LANGUAGES.length];

  function handleSwitch() {
    const newSegments = [...segments];
    newSegments[0] = nextLang.code;
    router.push('/' + newSegments.join('/'));
  }

  const displayLang = LANGUAGES.find((l) => l.code === currentLang)?.label ?? currentLang.toUpperCase();

  return (
    <button
      type='button'
      onClick={handleSwitch}
      className='cursor-pointer flex items-center gap-1 rounded-2xl bg-orange px-3 py-2 text-xs font-medium text-white transition-colors duration-200 hover:bg-dark-orange sm:px-6 sm:py-3 sm:text-sm'
      aria-label={`Switch language to ${nextLang.label}`}
      title={`Switch language to ${nextLang.label}`}
    >
      <MaterialIcon name='language' size='md'/>
      <span className='text-xs font-medium sm:text-sm'>{displayLang}</span>
    </button>
  );
}
