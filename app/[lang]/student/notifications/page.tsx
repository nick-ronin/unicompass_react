"use client";

import { useParams } from 'next/navigation';

const translations = {
  ru: {
    title: 'Уведомления',
    empty: 'Пока нет новых уведомлений',
    subtitle: 'Мы покажем здесь обновления по задачам, сообщениям и профилю',
  },
  en: {
    title: 'Notifications',
    empty: 'No new notifications yet',
    subtitle: 'Updates about tasks, messages, and profile will appear here',
  },
};

export default function NotificationsPage() {
  const params = useParams();
  const lang = typeof params.lang === 'string' ? params.lang : Array.isArray(params.lang) ? params.lang[0] : 'ru';
  const t = translations[lang as keyof typeof translations] || translations.ru;

  return (
    <div className='min-h-screen dark:bg-dark-gray py-12 px-6 md:px-12 lg:px-16'>
      <div className='max-w-5xl mx-auto bg-white dark:bg-surface rounded-3xl p-10 shadow-lg border border-light-blue-gray/60 dark:border-dark-gray'>
        <h1 className='text-4xl font-bold text-dark-gray dark:text-white mb-2'>{t.title}</h1>
        <p className='text-medium-blue-gray dark:text-gray mb-8'>{t.subtitle}</p>
        <div className='flex items-center gap-3 text-lg text-medium-blue-gray dark:text-gray'>
          <span className='material-symbols-outlined text-cyan text-3xl'>notifications_off</span>
          <span>{t.empty}</span>
        </div>
      </div>
    </div>
  );
}
