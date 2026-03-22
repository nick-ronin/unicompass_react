'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Calendar from '@/components/Calendar';
import Schedule from '@/components/Schedule';
import TaskCard from '@/components/Task Card';

interface Task {
    id: string;
    name: string;
    description: string;
    deadline: string;
    status: 'completed' | 'in-progress' | 'not completed';
}

const translations = {
    en: {
        pageTitle: 'Calendar',
        pageSubtitle: 'Manage your schedule and track tasks',
        upcomingTitle: 'Upcoming tasks',
        upcomingSubtitle: 'A list of tasks that require your attention',
        tasks: [
            {
                id: '1',
                name: 'History Essay',
                description: 'Write a 15-20 page essay about the Middle Ages',
                deadline: '2026-03-25',
                status: 'in-progress' as const,
            },
            {
                id: '2',
                name: 'Lab Assignment',
                description: 'Complete the physics lab assignment',
                deadline: '2026-03-27',
                status: 'not completed' as const,
            },
            {
                id: '3',
                name: 'Programming Project',
                description: 'Build a web application using React',
                deadline: '2026-03-30',
                status: 'not completed' as const,
            },
            {
                id: '4',
                name: 'Math Test',
                description: 'Prepare for and complete the test',
                deadline: '2026-04-02',
                status: 'not completed' as const,
            },
        ],
    },
    ru: {
        pageTitle: 'Календарь',
        pageSubtitle: 'Управляйте расписанием и отслеживайте задачи',
        upcomingTitle: 'Предстоящие задачи',
        upcomingSubtitle: 'Список задач, которые требуют внимания',
        tasks: [
            {
                id: '1',
                name: 'Эссе по истории',
                description: 'Напишите эссе на 15–20 страниц о Средневековье',
                deadline: '2026-03-25',
                status: 'in-progress' as const,
            },
            {
                id: '2',
                name: 'Лабораторная работа',
                description: 'Выполните задание по физике',
                deadline: '2026-03-27',
                status: 'not completed' as const,
            },
            {
                id: '3',
                name: 'Проект по программированию',
                description: 'Создайте веб-приложение на React',
                deadline: '2026-03-30',
                status: 'not completed' as const,
            },
            {
                id: '4',
                name: 'Контрольная по математике',
                description: 'Подготовьтесь и выполните контрольную',
                deadline: '2026-04-02',
                status: 'not completed' as const,
            },
        ],
    },
};

export default function CalendarPage() {
        const [selectedDate, setSelectedDate] = useState<Date>(new Date());
        const params = useParams();
        const lang = (params?.lang as 'ru' | 'en') || 'ru';
        const t = translations[lang] || translations.ru;
        const taskDates = t.tasks.map(task => new Date(task.deadline));

    return (
        <div className='px-48 py-8 flex flex-col'>
            {/* Header */}
            <div>
                                <h1 className='text-3xl font-bold text-dark-gray dark:text-white'>{t.pageTitle}</h1>
                                <p className='text-medium-blue-gray dark:text-gray'>
                                        {t.pageSubtitle}
                                </p>
            </div>

            {/* Calendar and Schedule Container */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 w-full justify-center items-center'>
                {/* Calendar */}
                <div>
                    <Calendar 
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        highlightedDates={taskDates}
                    />
                </div>

                {/* Schedule */}
                <div>
                    <Schedule 
                        date={selectedDate}
                    />
                </div>
            </div>

            {/* Upcoming Tasks Section */}
            <div className='space-y-4'>
                <div>
                    <h2 className='text-2xl font-bold text-dark-gray dark:text-white mb-1'>
                        {t.upcomingTitle}
                    </h2>
                    <p className='text-medium-blue-gray dark:text-gray'>
                        {t.upcomingSubtitle}
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {t.tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            name={task.name}
                            description={task.description}
                            deadline={task.deadline}
                            status={task.status}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
