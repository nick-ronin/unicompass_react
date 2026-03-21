'use client';

import Button from '@/components/Button';
import TaskCard from '@/components/Task Card';
import Calendar from '@/components/Calendar';
import { useState } from 'react';

export default function StudentHome() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Статистика студента
  const stats = [
    { label: 'Требует действия', value: '5', icon: 'priority_high' },
    { label: 'Завершено', value: '18', icon: 'check_circle' },
    { label: 'В процессе', value: '4', icon: 'schedule' },
  ];

  // Предстоящие задачи
  const upcomingTasks = [
    { name: 'Регистрация студента', description: 'Завершена регистрация в системе', deadline: '21 марта', status: 'completed' as const },
    { name: 'Оформление СИМ карты', description: 'Получить местный номер телефона', deadline: '22 марта', status: 'not completed' as const },
    { name: 'Продление регистрации', description: 'Оформить документ в миграционной службе', deadline: '25 марта', status: 'in-progress' as const },
  ];

  // События календаря
  const events = [
    { date: '22.03', event: 'Дедлайн оформления СИМ карты' },
    { date: '24.03', event: 'Консультация по жилищным вопросам' },
    { date: '25.03', event: 'Деньрождение адаптационного центра' },
  ];

  return (
    <div className='min-h-screen bg-linear-to-br from-background to-surface-secondary/30'>
      {/* Героический баннер */}
      <div className='relative overflow-hidden mb-8'>
        <div className='absolute inset-0 bg-linear-to-r from-cyan to-dark-cyan opacity-90'></div>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply blur-3xl'></div>
          <div className='absolute bottom-0 left-0 w-96 h-96 bg-light-green rounded-full mix-blend-multiply blur-3xl'></div>
        </div>
        
        <div className='relative px-8 py-16'>
          <div className='max-w-7xl mx-auto'>
            <h1 className='text-5xl font-bold text-white mb-3'>Добро пожаловать обратно! 👋</h1>
            <p className='text-xl text-white/90 mb-6'>Ты на правильному пути к успеху. Давай изучим, что ждёт тебя на этой неделе.</p>
            <Button className='bg-white text-cyan font-bold px-8 py-3 hover:bg-cyan hover:text-white transition-all hover:scale-105'>
              <span className='material-symbols-outlined'>flash_on</span>
              Мои задачи адаптации
            </Button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-8 pb-12'>
        {/* Статистика */}
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

        {/* Основной контент */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Левая колонка - Задачи */}
          <div className='lg:col-span-2'>
            <div className='bg-white dark:bg-surface rounded-3xl p-8 shadow-md'>
              <div className='flex items-center justify-between mb-8'>
                <div>
                  <h2 className='text-3xl font-bold mb-2'>Твои задачи адаптации</h2>
                  <p className='text-foreground/60'>Что нужно сделать для адаптации</p>
                </div>
                <Button className='bg-linear-to-r from-cyan to-dark-cyan text-white px-6 py-2 hover:shadow-lg transition-shadow'>
                  <span className='material-symbols-outlined'>add</span>
                  Добавить
                </Button>
              </div>

              <div className='space-y-4'>
                {upcomingTasks.map((task, index) => (
                  <div key={index} className='group'>
                    <div className='bg-linear-to-r from-background/50 to-transparent p-6 rounded-2xl border-l-4 border-orange hover:border-light-green transition-all cursor-pointer hover:shadow-md'>
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
                          {task.status === 'completed' ? '✓ Завершена' : 
                           task.status === 'in-progress' ? '◐ В процессе' : 
                           '○ Не начата'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button className='mt-8 w-full bg-background/50 text-foreground hover:bg-background transition-colors py-3 border border-foreground/10'>
                Все задачи адаптации
                <span className='material-symbols-outlined'>arrow_forward</span>
              </Button>
            </div>
          </div>

          {/* Правая колонка - Календарь и события */}
          <div className='space-y-6'>
            {/* Календарь */}
            <div className='bg-white dark:bg-surface rounded-3xl p-6 shadow-md'>
              <h3 className='text-xl font-bold mb-4'>Календарь</h3>
              <div className='bg-background/30 rounded-2xl p-4'>
                <Calendar />
              </div>
            </div>

            {/* События */}
            <div className='bg-white dark:bg-surface rounded-3xl p-6 shadow-md'>
              <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
                <span className='material-symbols-outlined text-cyan'>event_note</span>
                События
              </h3>
              <div className='space-y-3'>
                {events.map((event, index) => (
                  <div key={index} className='p-3 bg-linear-to-r from-cyan/10 to-light-green/10 rounded-xl border-l-2 border-cyan hover:border-light-green transition-all'>
                    <p className='text-sm font-bold text-cyan'>{event.date}</p>
                    <p className='text-sm text-foreground mt-1'>{event.event}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Быстрые ссылки */}
            <div className='bg-linear-to-br from-cyan/5 to-light-green/5 rounded-3xl p-6 border border-cyan/20'>
              <h3 className='text-lg font-bold mb-4'>Быстрые ссылки</h3>
              <div className='space-y-2'>
                <Button className='w-full justify-start bg-white/50 hover:bg-white text-foreground transition-all'>
                  <span className='material-symbols-outlined'>school</span>
                  База знаний
                </Button>
                <Button className='w-full justify-start bg-white/50 hover:bg-white text-foreground transition-all'>
                  <span className='material-symbols-outlined'>chat</span>
                  Чат с преподавателем
                </Button>
                <Button className='w-full justify-start bg-white/50 hover:bg-white text-foreground transition-all'>
                  <span className='material-symbols-outlined'>notifications</span>
                  Уведомления
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
