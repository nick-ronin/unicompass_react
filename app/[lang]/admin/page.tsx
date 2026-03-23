'use client';

import Button from '@/components/Button';
import { useParams } from 'next/navigation';

type Lang = 'ru' | 'en';

const translations = {
  en: {
    heroTitle: 'Adaptation and Educational Center 🎓',
    heroSubtitle: 'Helping international students adapt and integrate',
    dateLabel: 'Today',
    dateValue: '21 March 2026',
    analytics: [
      { label: 'Students in adaptation', value: '342', change: '+15%', icon: 'group', color: 'from-cyan to-dark-cyan' },
      { label: 'Need help', value: '47', change: '↑2', icon: 'support_agent', color: 'from-orange to-dark-orange' },
      { label: 'Successfully adapted', value: '89%', change: '+3%', icon: 'check_circle', color: 'from-light-green to-dark-cyan' },
      { label: 'Resolved requests', value: '156', change: '+12', icon: 'task_alt', color: 'from-yellow to-dark-yellow' },
    ],
    quickActionsTitle: 'Quick actions',
    quickActions: [
      { label: 'New student', icon: 'person_add', color: 'from-cyan/10 to-dark-cyan/10', border: 'border-cyan/30 hover:border-cyan/60' },
      { label: 'New appeal', icon: 'assignment_add', color: 'from-light-green/10 to-dark-cyan/10', border: 'border-light-green/30 hover:border-light-green/60' },
      { label: 'New event', icon: 'event', color: 'from-yellow/10 to-orange/10', border: 'border-yellow/30 hover:border-yellow/60' },
      { label: 'Documents', icon: 'description', color: 'from-orange/10 to-dark-orange/10', border: 'border-orange/30 hover:border-orange/60' },
    ],
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
    dateValue: '21 марта 2026',
    analytics: [
      { label: 'Студенты в адаптации', value: '342', change: '+15%', icon: 'group', color: 'from-cyan to-dark-cyan' },
      { label: 'Нужна помощь', value: '47', change: '↑2', icon: 'support_agent', color: 'from-orange to-dark-orange' },
      { label: 'Успешно адаптированы', value: '89%', change: '+3%', icon: 'check_circle', color: 'from-light-green to-dark-cyan' },
      { label: 'Обращений решено', value: '156', change: '+12', icon: 'task_alt', color: 'from-yellow to-dark-yellow' },
    ],
    quickActionsTitle: 'Быстрые действия',
    quickActions: [
      { label: 'Новый студент', icon: 'person_add', color: 'from-cyan/10 to-dark-cyan/10', border: 'border-cyan/30 hover:border-cyan/60' },
      { label: 'Новое обращение', icon: 'assignment_add', color: 'from-light-green/10 to-dark-cyan/10', border: 'border-light-green/30 hover:border-light-green/60' },
      { label: 'Новое событие', icon: 'event', color: 'from-yellow/10 to-orange/10', border: 'border-yellow/30 hover:border-yellow/60' },
      { label: 'Документы', icon: 'description', color: 'from-orange/10 to-dark-orange/10', border: 'border-orange/30 hover:border-orange/60' },
    ],
    needHelpTitle: 'Нужна помощь',
    allAppeals: 'Все обращения',
    help: 'Помочь',
    urgentIssues: [
      { student: 'Мария Иванова', issue: 'Нужна помощь с жильём', priority: 'high', icon: 'apartment' },
      { student: 'Али Мохаммед', issue: 'Проблема с постановкой на миграционный учёт', priority: 'high', icon: 'assignment' },
      { student: 'Юлия Петрова', issue: 'Требуется социальная стипендия', priority: 'medium', icon: 'card_giftcard' },
      { student: 'Томас Браун', issue: 'Продление визы — нужна справка из деканата', priority: 'high', icon: 'travel_explore' },
    ],
    activeCuratorsTitle: 'Активные кураторы',
    studentsLabel: 'студентов',
    activeCurators: [
      { name: 'Елена Сергеевна Козлова', students: 68, rating: 4.9, icon: '👩‍🏫' },
      { name: 'Иван Николаевич Волков', students: 52, rating: 4.8, icon: '👨‍🏫' },
      { name: 'Ольга Петровна Смирнова', students: 45, rating: 4.7, icon: '👩‍🏫' },
    ],
    integrationEventsTitle: 'Интеграционные события',
    events: [
      { date: '22.03', event: 'Консультация по подготовке документов', time: '11:00' },
      { date: '24.03', event: 'Знакомство с городом — экскурсия', time: '14:00' },
      { date: '26.03', event: 'Встреча с иностранными студентами', time: '16:00' },
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
  const analytics = t.analytics;
  const urgentIssues = t.urgentIssues;
  const activeCurators = t.activeCurators;
  const events = t.events;
  const recentActivity = t.recentActivity;

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
                  <p className='text-lg font-semibold'>{t.dateValue}</p>
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
                {t.quickActions.map((action) => (
                  <Button
                    key={action.label}
                    className={`flex flex-col items-center justify-center gap-3 py-6 px-4 bg-linear-to-br ${action.color} hover:from-cyan/20 hover:to-dark-cyan/20 transition-all rounded-2xl border ${action.border}`}
                  >
                    <span className='material-symbols-outlined text-3xl text-cyan'>{action.icon}</span>
                    <span className='font-semibold text-sm text-foreground'>{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Urgent questions students */}
            <div className='bg-white dark:bg-surface rounded-3xl p-8 shadow-md'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold'>{t.needHelpTitle}</h2>
                <Button className='text-cyan hover:text-dark-cyan transition-colors'>
                  {t.allAppeals}
                  <span className='material-symbols-outlined'>arrow_forward</span>
                </Button>
              </div>
              
              <div className='space-y-3'>
                {urgentIssues.map((issue, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-2xl border-l-4 ${
                      issue.priority === 'high' 
                        ? 'bg-orange/5 border-orange' 
                        : 'bg-yellow/5 border-yellow'
                    } hover:shadow-md transition-all cursor-pointer group`}
                  >
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        issue.priority === 'high' ? 'bg-orange/20' : 'bg-yellow/20'
                      }`}>
                        <span className={`material-symbols-outlined text-sm ${
                          issue.priority === 'high' ? 'text-orange' : 'text-yellow'
                        }`}>{issue.icon}</span>
                      </div>
                      <div className='min-w-0'>
                        <p className='font-semibold text-sm'>{issue.student}</p>
                        <p className='text-xs text-foreground/60 truncate'>{issue.issue}</p>
                      </div>
                    </div>
                    <Button className='text-xs bg-transparent hover:bg-foreground/10 text-foreground/70 px-3 py-1 transition-colors'>
                      {t.help}
                    </Button>
                  </div>
                ))}
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

            {/* Events and programs */}
            <div className='bg-linear-to-br from-light-green/10 to-cyan/10 rounded-3xl p-6 border border-light-green/30'>
              <h3 className='text-lg font-bold mb-4 flex items-center gap-2'>
                <span className='material-symbols-outlined text-light-green'>event_note</span>
                {t.integrationEventsTitle}
              </h3>
              <div className='space-y-3'>
                {events.map((evt, index) => (
                  <div key={index} className='p-3 bg-white/50 dark:bg-surface/50 rounded-xl'>
                    <p className='text-sm font-bold text-cyan'>{evt.date} • {evt.time}</p>
                    <p className='text-sm text-foreground mt-1'>{evt.event}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status work */}
            <div className='bg-linear-to-br from-light-green/10 to-cyan/10 rounded-3xl p-6 border border-light-green/30'>
              <h3 className='text-lg font-bold mb-4 flex items-center gap-2'>
                <span className='material-symbols-outlined text-light-green'>assessment</span>
                {t.todayStatsTitle}
              </h3>
              <div className='space-y-3'>
                {t.todayStats.map((item) => (
                  <div key={item.label} className='flex items-center justify-between text-sm'>
                    <span>{item.label}</span>
                    <span className='font-bold'>{item.value}</span>
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
    </div>
  );
}
