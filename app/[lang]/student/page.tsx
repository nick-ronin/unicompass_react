'use client';

import Button from '@/components/Button';
import TaskCard from '@/components/Task Card';
import Calendar from '@/components/Calendar';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type Lang = 'ru' | 'en';

const translations = {
  en: {
    heroTitle: 'Welcome back!',
    heroSubtitle: "You are on the right path to success. Here is what's coming this week.",
    heroCta: 'My tasks',
    stats: [
      { label: 'Needs action', value: '5', icon: 'priority_high' },
      { label: 'Completed', value: '18', icon: 'check_circle' },
      { label: 'In progress', value: '4', icon: 'schedule' },
    ],
    tasks: [
      { name: 'Student registration', description: 'Registration in the system completed', deadline: '21 March', status: 'completed' as const },
      { name: 'SIM card setup', description: 'Get a local phone number', deadline: '22 March', status: 'not completed' as const },
      { name: 'Registration extension', description: 'Submit documents to migration services', deadline: '25 March', status: 'in-progress' as const },
    ],
    taskStatuses: {
      completed: '✓ Completed',
      inProgress: '◐ In progress',
      notStarted: '○ Not started',
    },
    tasksTitle: 'Your tasks',
    tasksSubtitle: 'What needs to be done for adaptation',
    seeAllTasks: 'All adaptation tasks',
    calendarTitle: 'Calendar',
    quickLinksTitle: 'Quick links',
    quickLinks: [
      { label: 'Knowledge base', icon: 'school', path: 'knowledge-base' },
      { label: 'Chat', icon: 'chat', path: 'chat' },
      { label: 'Notifications', icon: 'notifications', path: 'notifications' },
    ],
  },
  ru: {
    heroTitle: 'С возвращением!',
    heroSubtitle: 'Вы на верном пути к успеху. Посмотрим, что ждёт вас на этой неделе.',
    heroCta: 'Мои задачи',
    stats: [
      { label: 'Требует внимания', value: '5', icon: 'priority_high' },
      { label: 'Завершено', value: '18', icon: 'check_circle' },
      { label: 'В процессе', value: '4', icon: 'schedule' },
    ],
    tasks: [
      { name: 'Регистрация студента', description: 'Регистрация в системе завершена', deadline: '21 марта', status: 'completed' as const },
      { name: 'Настройка SIM-карты', description: 'Получите местный номер телефона', deadline: '22 марта', status: 'not completed' as const },
      { name: 'Продление регистрации', description: 'Подайте документы в миграционные службы', deadline: '25 марта', status: 'in-progress' as const },
    ],
    taskStatuses: {
      completed: '✓ Завершено',
      inProgress: '◐ В работе',
      notStarted: '○ Не начата',
    },
    tasksTitle: 'Ваши задачи',
    tasksSubtitle: 'Что нужно сделать для адаптации',
    seeAllTasks: 'Все задачи адаптации',
    calendarTitle: 'Календарь',
    quickLinksTitle: 'Быстрые ссылки',
    quickLinks: [
      { label: 'База знаний', icon: 'school', path: 'knowledge-base' },
      { label: 'Чат', icon: 'chat', path: 'chat' },
      { label: 'Уведомления', icon: 'notifications', path: 'notifications' },
    ],
  },
};

export default function StudentHome() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const params = useParams();
  const lang = (params?.lang as Lang) || 'ru';
  const t = translations[lang] || translations.ru;
  const basePath = `/${lang}/student`;
  const stats = t.stats;
  const upcomingTasks = t.tasks;

  return (
    <div className='min-h-screen'>
      {/* Hero banner */}
      <div className='relative overflow-hidden mb-8'>
        <div className='absolute inset-0 bg-linear-to-r from-cyan to-dark-cyan opacity-90'></div>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply blur-3xl'></div>
          <div className='absolute bottom-0 left-0 w-96 h-96 bg-light-green rounded-full mix-blend-multiply blur-3xl'></div>
        </div>
        
        <div className='relative px-8 py-16'>
          <div className='max-w-7xl mx-auto'>
            <h1 className='text-5xl font-bold text-white mb-3'>{t.heroTitle}</h1>
            <p className='text-xl text-white/90 mb-6'>{t.heroSubtitle}</p>
            <Button className='bg-white text-cyan font-bold px-8 py-3 hover:bg-cyan hover:text-white transition-all hover:scale-105'>
              <Link href={`${basePath}/tasks`} className='flex flex-row items-start justify-center gap-2'>
                <span className='material-symbols-outlined'>flash_on</span>
                {t.heroCta}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-8 pb-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          {stats.map((stat, index) => (
            <div key={index} className='bg-white dark:bg-surface rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer group'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-foreground/70 text-sm font-medium mb-2'>{stat.label}</p>
                  <p className='text-4xl font-bold bg-linear-to-r from-cyan to-light-green bg-clip-text text-transparent'>{stat.value}</p>
                </div>
                <div className='w-16 h-16 bg-linear-to-br from-cyan/10 to-light-green/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform'>
                  <span className='material-symbols-outlined text-2xl text-cyan'>{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <div className='bg-white dark:bg-surface rounded-3xl p-8 shadow-md'>
              <div className='flex items-center justify-between mb-8'>
                <div>
                  <h2 className='text-3xl font-bold mb-2'>{t.tasksTitle}</h2>
                  <p className='text-foreground/60'>{t.tasksSubtitle}</p>
                </div>
              </div>

              <div className='space-y-4'>
                {upcomingTasks.map((task, index) => (
                  <div key={index} className='group'>
                    <div className='dark:bg-dark-gray bg-light-blue-gray p-6 rounded-4xl transition-all cursor-pointer hover:shadow-md'>
                      <div className='flex items-start justify-between mb-2'>
                        <div className='flex-1'>
                          <h3 className='text-lg font-bold mb-1'>{task.name}</h3>
                          <p className='text-foreground/70 text-sm mb-3'>{task.description}</p>
                          <div className='flex items-center gap-2 text-sm'>
                            <span className='material-symbols-outlined text-base'>calendar_today</span>
                            <span>{task.deadline}</span>
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                          task.status === 'completed' ? 'bg-light-green/20 text-light-green' :
                          task.status === 'in-progress' ? 'bg-yellow/20 text-yellow' :
                          'bg-orange/20 text-orange'
                        }`}>
                          {task.status === 'completed' ? t.taskStatuses.completed : 
                           task.status === 'in-progress' ? t.taskStatuses.inProgress : 
                           t.taskStatuses.notStarted}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button className='mt-8 w-full bg-background/50 text-foreground dark:hover:bg-dark-gray hover:bg-light-blue-gray transition-colors py-3 border border-foreground/10'>
                <Link href={`${basePath}/tasks`} className='flex flex-row items-center justify-center gap-4'>
                  {t.seeAllTasks}
                  <span className='material-symbols-outlined'>arrow_forward</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='bg-white dark:bg-surface rounded-3xl px-8 pb-2 pt-6 shadow-md'>
              <h3 className='text-xl font-bold mb-2'>{t.calendarTitle}</h3>
              <div className='bg-surface rounded-2xl'>
                <Calendar />
              </div>
            </div>

            <div className='rounded-3xl p-6 bg-surface'>
              <h3 className='text-lg font-bold mb-4'>{t.quickLinksTitle}</h3>
              <div className='space-y-2'>
                {t.quickLinks.map((link) => (
                  <Button key={link.path} className='w-full justify-start bg-light-blue-gray dark:bg-dark-gray text-foreground transition-all hover:shadow-md'>
                    <Link href={`${basePath}/${link.path}`} className='flex flex-row justify-center gap-2'>
                      <span className='material-symbols-outlined'>{link.icon}</span>
                      {link.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
