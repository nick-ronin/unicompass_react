'use client';

import { cn } from '@/lib/utils';
import { useScheduleByDate } from '@/lib/hooks';

export interface ScheduleItem {
    id: string;
    time: string;
    subject: string;
    type: 'лекция' | 'пр. занятие' | 'лаб. работа' | 'ЭИОС';
    location: string;
    isCurrent?: boolean;
}

interface ScheduleProps {
    date: Date;
    items?: ScheduleItem[];
    className?: string;
    useApiData?: boolean; // If true, fetch data from API
}

export default function Schedule({ date, items, className = '', useApiData = false }: ScheduleProps) {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    const { data: apiSchedule, loading, error } = useApiData ? useScheduleByDate(dateStr) : { data: null, loading: false, error: null };

    const defaultItems: ScheduleItem[] = [
        {
            id: '1',
            time: '09:00-10:30',
            subject: 'Математический анализ',
            type: 'лекция',
            location: 'Корпус №1, аудитория 101',
            isCurrent: true,
        },
        {
            id: '2',
            time: '10:40-12:10',
            subject: 'Английский язык',
            type: 'пр. занятие',
            location: 'Корпус №2, аудитория 205',
            isCurrent: false,
        },
        {
            id: '3',
            time: '13:00-14:30',
            subject: 'Основы программирования',
            type: 'лаб. работа',
            location: 'Корпус №3, компьютерный класс 301',
            isCurrent: false,
        },
        {
            id: '4',
            time: '14:40-16:10',
            subject: 'История',
            type: 'ЭИОС',
            location: 'Онлайн',
            isCurrent: false,
        },
    ];

    // Use provided items, API data, or defaults
    let displayItems: ScheduleItem[] = [];
    if (items && items.length > 0) {
        displayItems = items;
    } else if (useApiData && apiSchedule?.items) {
        displayItems = apiSchedule.items;
    } else {
        displayItems = defaultItems;
    }

    if (loading) {
        return (
            <div className={cn('p-4 bg-surface dark:bg-surface rounded-lg', className)}>
                <div className='animate-pulse'>
                    <div className='h-6 bg-gray-300 rounded mb-4 w-1/3'></div>
                    <div className='space-y-2'>
                        {[1, 2, 3].map(i => (
                            <div key={i} className='h-20 bg-gray-300 rounded'></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cn('p-4 bg-red-50 dark:bg-red-900/20 rounded-lg', className)}>
                <p className='text-red-600 dark:text-red-400'>Ошибка при загрузке расписания: {error}</p>
            </div>
        );
    }

    return (
        <div className={cn('p-4', className)}>
            <div className='mb-4'>
                <h3 className='text-2xl text-dark-gray dark:text-white'>
                    Расписание на {date.toLocaleDateString('ru-RU', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                    })}
                </h3>
            </div>

            <div className='flex flex-col gap-3'>
                {displayItems.length > 0 ? (
                    displayItems.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                'py-3 px-6 rounded-4xl flex justify-between items-start transition-colors',
                                item.isCurrent
                                    ? 'bg-cyan text-white'
                                    : 'bg-light-blue-gray text-dark-gray'
                            )}
                        >
                            <div className='flex-1 space-y-0.26'>
                                <h4 className='text-2xl'>
                                    {item.subject}
                                </h4>
                                <p className='text-lg opacity-90'>
                                    {item.type}
                                </p>
                                <p className='text-lg opacity-90'>
                                    {item.location}
                                </p>
                            </div>
                            <div className='text-right text-lg whitespace-nowrap'>
                                {item.time}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-center py-8 text-medium-blue-gray dark:text-gray'>
                        <p>Нет занятий на этот день</p>
                    </div>
                )}
            </div>
        </div>
    );
}