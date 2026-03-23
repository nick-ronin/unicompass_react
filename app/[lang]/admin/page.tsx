'use client';

import Link from 'next/link';
import Button from '@/components/Button';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import TaskAssignmentModal from '@/components/TaskAssignmentModal';

type Lang = 'ru' | 'en';

const translations = {
  en: {
    heroTitle: 'Adaptation and Educational Center 🎓',
    heroSubtitle: 'Helping international students adapt and integrate',
    dateLabel: 'Today',
    analyticsLabels: {
      students: 'Students in adaptation',
      tasks: 'Total tasks',
      completedToday: 'Completed today',
      needHelp: 'Need help',
    },
    quickActionsTitle: 'Quick actions',
    quickActions: {
      students: 'All students',
      assign: 'Assign task',
      tasks: 'All tasks',
      chat: 'Chat',
      newMessages: (count: number) => `${count} new messages`,
    },
    needHelpTitle: 'Need help',
    allAppeals: 'All appeals',
    help: 'Help',
    urgentIssues: [
      { student: 'Maria Ivanova', issue: 'Needs housing assistance', priority: 'high', icon: 'apartment' },
      { student: 'Ali Mohammed', issue: 'Issue with migration registration', priority: 'high', icon: 'assignment' },
      { student: 'Yulia Petrova', issue: 'Social scholarship required', priority: 'medium', icon: 'card_giftcard' },
      { student: 'Thomas Brown', issue: "Visa extension—certificate from the dean's office", priority: 'high', icon: 'travel_explore' },
    ],
    activeCuratorsTitle: 'Active curators',
    studentsLabel: 'students',
    activeCurators: [
      { name: 'Elena Sergeevna Kozlova', students: 68, rating: 4.9, icon: '👩‍🏫' },
      { name: 'Ivan Nikolaevich Volkov', students: 52, rating: 4.8, icon: '👨‍🏫' },
      { name: 'Olga Petrovna Smirnova', students: 45, rating: 4.7, icon: '👩‍🏫' },
    ],
    integrationEventsTitle: 'Integration events',
    events: [
      { date: '22.03', event: 'Consultation on document preparation', time: '11:00' },
      { date: '24.03', event: 'City introduction tour', time: '14:00' },
      { date: '26.03', event: 'Meeting with international students', time: '16:00' },
    ],
    todayStatsTitle: "Today's statistics",
    todayStats: [
      { label: 'Requests processed', value: '12' },
      { label: 'Issues resolved', value: '8' },
      { label: 'Consultations provided', value: '6' },
    ],
    recentActivityTitle: 'Recent activity',
    recentActivity: [
      { type: 'success', name: 'Anna Lebedeva', action: 'Successfully registered with the migration service', time: '30 min ago', icon: 'verified' },
      { type: 'urgent', name: 'New urgent request', action: 'Appeal received from Mohammed', time: '1 hour ago', icon: 'home' },
      { type: 'success', name: 'Victor Sidorov', action: 'Received a social scholarship', time: '2 hours ago', icon: 'monetization_on' },
      { type: 'info', name: 'Integration Day', action: 'Scheduled for 30.03 at 15:00', time: '5 hours ago', icon: 'event' },
    ],
    viewAllActivity: 'View all activity',
  },
  ru: {
    heroTitle: 'Центр адаптации и воспитательной работы 🎓',
    heroSubtitle: 'Помогаем иностранным студентам в адаптации и интеграции',
    dateLabel: 'Сегодня',
    analyticsLabels: {
      students: 'Студенты в адаптации',
      tasks: 'Всего задач',
      completedToday: 'Выполнено за день',
      needHelp: 'Нужна помощь',
    },
    quickActionsTitle: 'Быстрые действия',
    quickActions: {
      students: 'Все студенты',
      assign: 'Назначить задачу',
      tasks: 'Все задачи',
      chat: 'Чат',
      newMessages: (count: number) => `${count} новых сообщений`,
    },
    activeCuratorsTitle: 'Активные кураторы',
    studentsLabel: 'студентов',
    activeCurators: [
      { name: 'Елена Сергеевна Козлова', students: 68, rating: 4.9, icon: '👩‍🏫' },
      { name: 'Иван Николаевич Волков', students: 52, rating: 4.8, icon: '👨‍🏫' },
      { name: 'Ольга Петровна Смирнова', students: 45, rating: 4.7, icon: '👩‍🏫' },
    ],
    todayStatsTitle: 'Статистика за сегодня',
    todayStats: [
      { label: 'Обработано обращений', value: '12' },
      { label: 'Решено проблем', value: '8' },
      { label: 'Проведено консультаций', value: '6' },
    ],
    recentActivityTitle: 'Последние события',
    recentActivity: [
      { type: 'success', name: 'Анна Лебедева', action: 'Успешно встала на миграционный учёт', time: '30 минут назад', icon: 'verified' },
      { type: 'urgent', name: 'Новое обращение', action: 'Получено обращение от Мохаммеда', time: '1 час назад', icon: 'home' },
      { type: 'success', name: 'Виктор Сидоров', action: 'Получил социальную стипендию', time: '2 часа назад', icon: 'monetization_on' },
      { type: 'info', name: 'День интеграции', action: 'Назначен на 30.03 в 15:00', time: '5 часов назад', icon: 'event' },
    ],
    viewAllActivity: 'Показать всю активность',
  },
};

export default function AdminHomePage() {
  const params = useParams();
  const lang = (params?.lang as Lang) || 'ru';
  const t = translations[lang] || translations.ru;
  const activeCurators = t.activeCurators;
  const recentActivity = t.recentActivity;
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const newMessagesCount = 3;
  const [studentsCount, setStudentsCount] = useState<number | null>(null);
  const [tasksCount, setTasksCount] = useState<number | null>(null);
  const [completedToday, setCompletedToday] = useState<number | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  const todayDate = useMemo(() => {
    return new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [lang]);

  const buildAuthHeaders = (): Record<string, string> => {
    const token =
      (typeof window !== 'undefined' && localStorage.getItem('jwt')) ||
      (typeof window !== 'undefined' && localStorage.getItem('accessToken')) ||
      (typeof window !== 'undefined' && localStorage.getItem('token'));

    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const safeCount = (data: any): number => {
    if (Array.isArray(data)) return data.length;
    if (Array.isArray(data?.data)) return data.data.length;
    if (typeof data?.pagination?.total === 'number') return data.pagination.total;
    if (typeof data?.count === 'number') return data.count;
    if (typeof data?.completed_count === 'number') return data.completed_count;
    return 0;
  };

  const loadMetrics = async () => {
    try {
      setLoadingMetrics(true);

      const [studentsRes, tasksRes, completedRes] = await Promise.all([
        fetch('/api/student/info_list', { headers: { ...buildAuthHeaders() } }),
        fetch('/api/task', { headers: { ...buildAuthHeaders() } }),
        fetch('/api/student_task/completed/count', { headers: { ...buildAuthHeaders() } }),
      ]);

      if (studentsRes.ok) {
        const data = await studentsRes.json().catch(() => null);
        setStudentsCount(safeCount(data));
      }

      if (tasksRes.ok) {
        const data = await tasksRes.json().catch(() => null);
        setTasksCount(safeCount(data));
      }

      if (completedRes.ok) {
        const data = await completedRes.json().catch(() => null);
        setCompletedToday(safeCount(data));
      }
    } catch (err) {
      console.warn('Metrics load failed', err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const analytics = useMemo(() => {
    const needHelpValue = studentsCount != null && completedToday != null
      ? Math.max(studentsCount - completedToday, 0)
      : null;

    return [
      {
        label: t.analyticsLabels.students,
        value: studentsCount != null ? studentsCount.toString() : '—',
        change: '',
        icon: 'group',
        color: 'from-cyan to-dark-cyan',
      },
      {
        label: t.analyticsLabels.tasks,
        value: tasksCount != null ? tasksCount.toString() : '—',
        change: '',
        icon: 'checklist',
        color: 'from-orange to-dark-orange',
      },
      {
        label: t.analyticsLabels.completedToday,
        value: completedToday != null ? completedToday.toString() : '—',
        change: '',
        icon: 'task_alt',
        color: 'from-light-green to-dark-cyan',
      },
      {
        label: t.analyticsLabels.needHelp,
        value: needHelpValue != null ? needHelpValue.toString() : '—',
        change: '',
        icon: 'support_agent',
        color: 'from-yellow to-dark-yellow',
      },
    ];
  }, [t.analyticsLabels, studentsCount, tasksCount, completedToday]);

  const quickActions = [
    {
      key: 'students',
      label: t.quickActions.students,
      icon: 'group',
      href: `/${lang}/admin/tables/students`,
      color: 'from-cyan/10 to-dark-cyan/10',
      border: 'border-cyan/30 hover:border-cyan/60',
    },
    {
      key: 'assign',
      label: t.quickActions.assign,
      icon: 'assignment_turned_in',
      action: () => setIsAssignModalOpen(true),
      color: 'from-light-green/10 to-dark-cyan/10',
      border: 'border-light-green/30 hover:border-light-green/60',
    },
    {
      key: 'tasks',
      label: t.quickActions.tasks,
      icon: 'checklist',
      href: `/${lang}/admin/tasks`,
      color: 'from-yellow/10 to-orange/10',
      border: 'border-yellow/30 hover:border-yellow/60',
    },
    {
      key: 'chat',
      label: t.quickActions.chat,
      icon: 'chat',
      href: `/${lang}/admin/chat`,
      color: 'from-orange/10 to-dark-orange/10',
      border: 'border-orange/30 hover:border-orange/60',
      badge: t.quickActions.newMessages(newMessagesCount),
    },
  ];

  const handleAssignSubmit = async (data: { name: string; description: string; deadline: string; studentIds: string[] }) => {
    try {
      setAssignLoading(true);
      await fetch('/api/student_task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          deadline: data.deadline,
          student_ids: data.studentIds,
        }),
      });
    } catch (err) {
      console.error('Assign task error', err);
    } finally {
      setAssignLoading(false);
      setIsAssignModalOpen(false);
    }
  };

  return (
    <div className='min-h-screen'>
      {/* Heroic Banner */}
      <div className='relative overflow-hidden mb-8'>
        <div className='absolute inset-0 bg-linear-to-r from-dark-cyan via-cyan to-light-green opacity-95'></div>
        <div className='absolute inset-0 opacity-15'>
          <div className='absolute top-0 right-0 w-96 h-96 bg-orange rounded-full mix-blend-multiply blur-3xl'></div>
          <div className='absolute bottom-0 left-0 w-96 h-96 bg-light-green rounded-full mix-blend-multiply blur-3xl'></div>
        </div>
        
        <div className='relative px-8 py-16'>
          <div className='max-w-7xl mx-auto'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-5xl font-bold text-white mb-3'>{t.heroTitle}</h1>
                <p className='text-xl text-white/90'>{t.heroSubtitle}</p>
              </div>
              <div className='hidden lg:flex items-center gap-3'>
                <div className='text-right text-white'>
                  <p className='text-sm opacity-90'>{t.dateLabel}</p>
                  <p className='text-lg font-semibold'>{todayDate}</p>
                </div>
                <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center'>
                  <span className='material-symbols-outlined text-white'>calendar_today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-8 pb-12'>
        {/* ГлаVные метрAndкAnd adaptation */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
          {analytics.map((metric, index) => (
            <div 
              key={index} 
              className='bg-white dark:bg-surface rounded-3xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group'
            >
              <div className='flex items-start justify-between mb-6'>
                <div className={`w-14 h-14 bg-linear-to-br ${metric.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <span className='material-symbols-outlined text-white text-2xl'>{metric.icon}</span>
                </div>
                <span className={`text-sm font-semibold ${metric.change.includes('+') || metric.change.includes('↑') ? 'text-light-green' : 'text-orange'}`}>
                  {metric.change}
                </span>
              </div>
              <p className='text-foreground/70 text-sm font-medium mb-2'>{metric.label}</p>
              <p className='text-4xl font-bold'>{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
          {/* Left Column - Control */}
          <div className='lg:col-span-2'>
            {/* Quick Actions */}
            <div className='bg-white dark:bg-surface rounded-3xl p-8 shadow-md mb-8'>
              <h2 className='text-2xl font-bold mb-6'>{t.quickActionsTitle}</h2>
              <div className='grid grid-cols-2 gap-4'>
                {quickActions.map((action) => {
                  const content = (
                    <div className={`relative w-full h-full flex flex-col items-center justify-center gap-3 py-6 px-4 bg-linear-to-br ${action.color} hover:from-cyan/20 hover:to-dark-cyan/20 transition-all rounded-2xl cursor-pointer border ${action.border}`}>
                      {action.badge && (
                        <span className='absolute top-3 right-3 text-xs font-semibold bg-orange text-white px-3 py-1 rounded-full'>
                          {action.badge}
                        </span>
                      )}
                      <span className='material-symbols-outlined text-3xl text-cyan'>{action.icon}</span>
                      <span className='font-semibold text-sm text-foreground text-center'>{action.label}</span>
                    </div>
                  );

                  if (action.href) {
                    return (
                      <Link key={action.key} href={action.href} className='block h-full'>
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={action.key}
                      type='button'
                      onClick={action.action}
                      className='w-full text-left'
                    >
                      {content}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className='space-y-6'>
            {/* Curators */}
            <div className='bg-white dark:bg-surface rounded-3xl p-6 shadow-md'>
              <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
                <span className='material-symbols-outlined text-cyan'>supervisor_account</span>
                {t.activeCuratorsTitle}
              </h3>
              <div className='space-y-3'>
                {activeCurators.map((curator, index) => (
                  <div key={index} className='p-3 bg-background/30 rounded-xl hover:bg-background/60 transition-colors cursor-pointer'>
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex items-center gap-2 flex-1 min-w-0'>
                        <span className='text-lg shrink-0'>{curator.icon}</span>
                        <div className='min-w-0'>
                          <p className='text-sm font-semibold line-clamp-1'>{curator.name}</p>
                          <p className='text-xs text-foreground/60'>{curator.students} {t.studentsLabel}</p>
                        </div>
                      </div>
                      <span className='text-sm font-bold text-yellow flex items-center gap-1 shrink-0'>
                        <span className='material-symbols-outlined text-sm'>star</span>
                        {curator.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className='bg-white dark:bg-surface rounded-3xl p-8 shadow-md'>
          <h2 className='text-2xl font-bold mb-6 flex items-center gap-2'>
            <span className='material-symbols-outlined text-cyan'>history</span>
            {t.recentActivityTitle}
          </h2>
          
          <div className='space-y-3'>
            {recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className='flex items-center gap-4 p-4 bg-background/30 rounded-2xl hover:bg-background/60 transition-colors cursor-pointer group'
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  activity.type === 'urgent' ? 'bg-orange/20' :
                  activity.type === 'success' ? 'bg-light-green/20' :
                  'bg-cyan/20'
                }`}>
                  <span className={`material-symbols-outlined text-sm ${
                    activity.type === 'urgent' ? 'text-orange' :
                    activity.type === 'success' ? 'text-light-green' :
                    'text-cyan'
                  }`}>{activity.icon}</span>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='font-semibold text-sm'>{activity.name}</p>
                  <p className='text-xs text-foreground/60'>{activity.action}</p>
                </div>
                <span className='text-xs text-foreground/50 whitespace-nowrap'>{activity.time}</span>
              </div>
            ))}
          </div>

          <Button className='mt-6 w-full bg-background/50 text-foreground hover:bg-background transition-colors py-3 border border-foreground/10'>
            {t.viewAllActivity}
            <span className='material-symbols-outlined'>arrow_forward</span>
          </Button>
        </div>
      </div>
      <TaskAssignmentModal
        isOpen={isAssignModalOpen}
        isLoading={assignLoading}
        onClose={() => setIsAssignModalOpen(false)}
        onSubmit={handleAssignSubmit}
        lang={lang}
      />
    </div>
  );
}
