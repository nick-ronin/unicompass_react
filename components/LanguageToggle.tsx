'use client';

import { usePathname, useRouter } from 'next/navigation';

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
      className='flex items-center gap-1 cursor-pointer transition-colors duration-200 bg-orange text-white hover:bg-dark-orange px-6 py-3 rounded-2xl'
      aria-label={`Сменить язык на ${nextLang.label}`}
      title={`Сменить язык на ${nextLang.label}`}
    >
      <span className='icon'>language</span>
      <span className='text-sm font-medium'>{displayLang}</span>
    </button>
  );
}
