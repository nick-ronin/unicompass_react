'use client';

import TaskCompletionStats from '@/components/analytics/TaskCompletionStats';
import ExaminationStats from '@/components/analytics/ExaminationStats';
import StudentArrivalsChart from '@/components/analytics/StudentArrivalsChart';
import { useParams } from 'next/navigation';

const translations = {
  ru: {
    title: 'Аналитика',
    subtitle: 'Мониторинг выполнения задач и статистика студентов',
  },
  en: {
    title: 'Analytics',
    subtitle: 'Task performance monitoring and student statistics',
  },
};

export default function AdminAnalyticsPage() {
  const params = useParams();
  const lang = typeof params.lang === 'string' ? params.lang : Array.isArray(params.lang) ? params.lang[0] : 'ru';
  const t = translations[lang as keyof typeof translations] || translations.ru;

  return (
    <div className='min-h-screen dark:bg-dark-gray px-8 py-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-12'>
          <h1 className='text-4xl font-extrabold text-black dark:text-white mb-2'>{t.title}</h1>
          <p className='text-gray dark:text-medium-warm-gray'>{t.subtitle}</p>
        </div>

        {/* Task Completion Stats */}
        <div className='mb-12 w-full overflow-hidden'>
          <TaskCompletionStats />
        </div>

        {/* Charts Section */}
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12 w-full'>
          {/* Examination Stats */}
          <div className='w-full overflow-hidden'>
            <ExaminationStats />
          </div>
          
          {/* Medical Examination Stats */}
          <div className='w-full overflow-hidden'>
            <ExaminationStats type='medical' />
          </div>
        </div>

        {/* Student Arrivals Chart */}
        <div className='mb-12 w-full overflow-hidden'>
          <StudentArrivalsChart />
        </div>
      </div>
    </div>
  );
}
