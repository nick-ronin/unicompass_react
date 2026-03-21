'use client';

import Button from '@/components/Button';

export default function AdminHomePage() {

  // Аналитика адаптации
  const analytics = [
    { 
      label: 'Студентов в адаптации', 
      value: '342', 
      change: '+15%', 
      icon: 'group',
      color: 'from-cyan to-dark-cyan'
    },
    { 
      label: 'Требуют помощи', 
      value: '47', 
      change: '↑2', 
      icon: 'support_agent',
      color: 'from-orange to-dark-orange'
    },
    { 
      label: 'Успешно адаптировались', 
      value: '89%', 
      change: '+3%', 
      icon: 'check_circle',
      color: 'from-light-green to-dark-cyan'
    },
    { 
      label: 'Решено обращений', 
      value: '156', 
      change: '+12', 
      icon: 'task_alt',
      color: 'from-yellow to-dark-yellow'
    },
  ];

  // Приоритетные вопросы
  const urgentIssues = [
    { student: 'Мария Иванова', issue: 'Нужна помощь с жильём', priority: 'high', icon: 'apartment' },
    { student: 'Али Мохаммед', issue: 'Проблема с регистрацией в миграционной службе', priority: 'high', icon: 'assignment' },
    { student: 'Юлия Петрова', issue: 'Требуется социальная стипендия', priority: 'medium', icon: 'card_giftcard' },
    { student: 'Томас Браун', issue: 'Продление визы - справка в деканате', priority: 'high', icon: 'travel_explore' },
  ];

  // Наиболее активные кураторы
  const activeCurators = [
    { name: 'Елена Сергеевна Козлова', students: 68, rating: 4.9, icon: '👩‍🏫' },
    { name: 'Иван Николаевич Волков', students: 52, rating: 4.8, icon: '👨‍🏫' },
    { name: 'Ольга Петровна Смирнова', students: 45, rating: 4.7, icon: '👩‍🏫' },
  ];

  // Недавняя активность
  const recentActivity = [
    { type: 'success', name: 'Анна Лебедева', action: 'успешно зарегистрирована в ФМС', time: '30 мин назад', icon: 'verified' },
    { type: 'urgent', name: 'Жилищный вопрос', action: 'подано новое обращение от Мохаммеда', time: '1 час назад', icon: 'home' },
    { type: 'success', name: 'Виктор Сидоров', action: 'получил социальную стипендию', time: '2 часа назад', icon: 'monetization_on' },
    { type: 'info', name: 'Интеграционный день', action: 'запланирован на 30.03 в 15:00', time: '5 часов назад', icon: 'event' },
  ];

  // События и интеграционные программы
  const events = [
    { date: '22.03', event: 'Консультация по оформлению документов', time: '11:00' },
    { date: '24.03', event: 'Знакомство с городом - экскурсия', time: '14:00' },
    { date: '26.03', event: 'Встреча с иностранными студентами', time: '16:00' },
  ];

  return (
    <div className='min-h-screen bg-linear-to-br from-background to-surface-secondary/30'>
      {/* Героический баннер */}
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
                <h1 className='text-5xl font-bold text-white mb-3'>Центр адаптации и воспитательной работы 🎓</h1>
                <p className='text-xl text-white/90'>Помощь иностранным студентам в адаптации и интеграции</p>
              </div>
              <div className='hidden lg:flex items-center gap-3'>
                <div className='text-right text-white'>
                  <p className='text-sm opacity-90'>Сегодня</p>
                  <p className='text-lg font-semibold'>21 марта 2026</p>
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
        {/* Главные метрики адаптации */}
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

        {/* Основной контент */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
          {/* Левая колонка - Управление */}
          <div className='lg:col-span-2'>
            {/* Быстрые действия */}
            <div className='bg-white dark:bg-surface rounded-3xl p-8 shadow-md mb-8'>
              <h2 className='text-2xl font-bold mb-6'>Быстрые действия</h2>
              <div className='grid grid-cols-2 gap-4'>
                <Button className='flex flex-col items-center justify-center gap-3 py-6 px-4 bg-linear-to-br from-cyan/10 to-dark-cyan/10 hover:from-cyan/20 hover:to-dark-cyan/20 transition-all rounded-2xl border border-cyan/30 hover:border-cyan/60'>
                  <span className='material-symbols-outlined text-3xl text-cyan'>person_add</span>
                  <span className='font-semibold text-sm text-foreground'>Новый студент</span>
                </Button>
                <Button className='flex flex-col items-center justify-center gap-3 py-6 px-4 bg-linear-to-br from-light-green/10 to-dark-cyan/10 hover:from-light-green/20 hover:to-dark-cyan/20 transition-all rounded-2xl border border-light-green/30 hover:border-light-green/60'>
                  <span className='material-symbols-outlined text-3xl text-light-green'>assignment_add</span>
                  <span className='font-semibold text-sm text-foreground'>Новое обращение</span>
                </Button>
                <Button className='flex flex-col items-center justify-center gap-3 py-6 px-4 bg-linear-to-br from-yellow/10 to-orange/10 hover:from-yellow/20 hover:to-orange/20 transition-all rounded-2xl border border-yellow/30 hover:border-yellow/60'>
                  <span className='material-symbols-outlined text-3xl text-yellow'>event</span>
                  <span className='font-semibold text-sm text-foreground'>Новое событие</span>
                </Button>
                <Button className='flex flex-col items-center justify-center gap-3 py-6 px-4 bg-linear-to-br from-orange/10 to-dark-orange/10 hover:from-orange/20 hover:to-dark-orange/20 transition-all rounded-2xl border border-orange/30 hover:border-orange/60'>
                  <span className='material-symbols-outlined text-3xl text-orange'>description</span>
                  <span className='font-semibold text-sm text-foreground'>Документы</span>
                </Button>
              </div>
            </div>

            {/* Срочные вопросы студентов */}
            <div className='bg-white dark:bg-surface rounded-3xl p-8 shadow-md'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold'>Требуют помощи</h2>
                <Button className='text-cyan hover:text-dark-cyan transition-colors'>
                  Все обращения
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
                      Помочь
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Правая колонка */}
          <div className='space-y-6'>
            {/* Кураторы */}
            <div className='bg-white dark:bg-surface rounded-3xl p-6 shadow-md'>
              <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
                <span className='material-symbols-outlined text-cyan'>supervisor_account</span>
                Активные кураторы
              </h3>
              <div className='space-y-3'>
                {activeCurators.map((curator, index) => (
                  <div key={index} className='p-3 bg-background/30 rounded-xl hover:bg-background/60 transition-colors cursor-pointer'>
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex items-center gap-2 flex-1 min-w-0'>
                        <span className='text-lg shrink-0'>{curator.icon}</span>
                        <div className='min-w-0'>
                          <p className='text-sm font-semibold line-clamp-1'>{curator.name}</p>
                          <p className='text-xs text-foreground/60'>{curator.students} студентов</p>
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

            {/* События и программы */}
            <div className='bg-linear-to-br from-light-green/10 to-cyan/10 rounded-3xl p-6 border border-light-green/30'>
              <h3 className='text-lg font-bold mb-4 flex items-center gap-2'>
                <span className='material-symbols-outlined text-light-green'>event_note</span>
                Интеграционные события
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

            {/* Статус работы */}
            <div className='bg-linear-to-br from-light-green/10 to-cyan/10 rounded-3xl p-6 border border-light-green/30'>
              <h3 className='text-lg font-bold mb-4 flex items-center gap-2'>
                <span className='material-symbols-outlined text-light-green'>assessment</span>
                Статистика на сегодня
              </h3>
              <div className='space-y-3'>
                <div className='flex items-center justify-between text-sm'>
                  <span>Обработано обращений</span>
                  <span className='font-bold'>12</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span>Решено проблем</span>
                  <span className='font-bold'>8</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span>Консультаций проведено</span>
                  <span className='font-bold'>6</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Недавняя активность */}
        <div className='bg-white dark:bg-surface rounded-3xl p-8 shadow-md'>
          <h2 className='text-2xl font-bold mb-6 flex items-center gap-2'>
            <span className='material-symbols-outlined text-cyan'>history</span>
            Недавняя активность
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
            Просмотреть всю активность
            <span className='material-symbols-outlined'>arrow_forward</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
