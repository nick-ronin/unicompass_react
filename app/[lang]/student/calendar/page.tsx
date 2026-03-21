'use client';

import { useState } from 'react';
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

// Mock data for upcoming tasks
const mockUpcomingTasks: Task[] = [
    {
        id: '1',
        name: 'Реферат по истории',
        description: 'Написать реферат на 15-20 страниц о Средневековье',
        deadline: '2026-03-25',
        status: 'in-progress',
    },
    {
        id: '2',
        name: 'Лабораторная работа',
        description: 'Выполнить лабораторную работу по физике',
        deadline: '2026-03-27',
        status: 'not completed',
    },
    {
        id: '3',
        name: 'Проект по программированию',
        description: 'Создать веб-приложение с использованием React',
        deadline: '2026-03-30',
        status: 'not completed',
    },
    {
        id: '4',
        name: 'Тест по математике',
        description: 'Подготовиться и пройти тест',
        deadline: '2026-04-02',
        status: 'not completed',
    },
];

// Mock task dates for calendar highlighting
const taskDates = mockUpcomingTasks.map(task => new Date(task.deadline));

export default function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    return (
        <div className='px-48 py-8 flex flex-col'>
            {/* Header */}
            <div>
                <h1 className='text-3xl font-bold text-dark-gray dark:text-white'>Календарь</h1>
                <p className='text-medium-blue-gray dark:text-gray'>
                    Управляйте своим расписанием и отслеживайте задачи
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
                        Ближайшие задачи
                    </h2>
                    <p className='text-medium-blue-gray dark:text-gray'>
                        Список задач, требующих вашего внимания
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {mockUpcomingTasks.map((task) => (
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
