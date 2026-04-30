'use client';

import { cn } from '@/lib/utils';
import { useScheduleByDate } from '@/lib/hooks';

export interface ScheduleItem {
    id: string;
    time: string;
    subject: string;
    type: 'lecture' | 'practical class' | 'lab work' | 'LMS';
    location: string;
    isCurrent?: boolean;
}

interface ScheduleProps {
    date: Date;
    items?: ScheduleItem[];
    className?: string;
    useApiData?: boolean; // If true, fetch data from API
    lang?: 'ru' | 'en';
    timeZone?: 'Asia/Novosibirsk' | 'Europe/Moscow';
}

const parseTimeRangeToMinutes = (range: string): { start: number; end: number } | null => {
    const [startStr, endStr] = range.split('-').map((part) => part?.trim());
    if (!startStr || !endStr) return null;

    const parsePart = (value: string) => {
        const [hoursStr, minutesStr] = value.split(':');
        const hours = Number(hoursStr);
        const minutes = Number(minutesStr);
        if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
        return hours * 60 + minutes;
    };

    const start = parsePart(startStr);
    const end = parsePart(endStr);
    if (start == null || end == null) return null;
    return { start, end };
};

const getNowMinutesInTimeZone = (timeZone: string): number | null => {
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
        });
        const parts = formatter.formatToParts(new Date());
        const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '');
        const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '');
        if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
        return hour * 60 + minute;
    } catch (_err) {
        return null;
    }
};

const getDatePartsInTimeZone = (date: Date, timeZone: string): { year: number; month: number; day: number } | null => {
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        const parts = formatter.formatToParts(date);
        const year = Number(parts.find((p) => p.type === 'year')?.value ?? '');
        const month = Number(parts.find((p) => p.type === 'month')?.value ?? '');
        const day = Number(parts.find((p) => p.type === 'day')?.value ?? '');
        if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return null;
        return { year, month, day };
    } catch (_err) {
        return null;
    }
};

const isSameDayInTimeZone = (a: Date, b: Date, timeZone: string): boolean => {
    const aParts = getDatePartsInTimeZone(a, timeZone);
    const bParts = getDatePartsInTimeZone(b, timeZone);
    if (!aParts || !bParts) return false;
    return aParts.year === bParts.year && aParts.month === bParts.month && aParts.day === bParts.day;
};

export default function Schedule({
    date,
    items,
    className = '',
    useApiData = false,
    lang = 'ru',
    timeZone = 'Asia/Novosibirsk',
}: ScheduleProps) {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    const { data: apiSchedule, loading, error } = useApiData ? useScheduleByDate(dateStr) : { data: null, loading: false, error: null };

    const translateType = (type: ScheduleItem['type'], currentLang: 'ru' | 'en') => {
        const map: Record<ScheduleItem['type'], { ru: string; en: string }> = {
            'lecture': { ru: 'Лекция', en: 'Lecture' },
            'practical class': { ru: 'Практическое занятие', en: 'Practical class' },
            'lab work': { ru: 'Лабораторная работа', en: 'Lab work' },
            'LMS': { ru: 'ЭИОС', en: 'Online (LMS)' },
        };
        return map[type]?.[currentLang] || type;
    };

    const defaultItems: Record<'ru' | 'en', ScheduleItem[]> = {
        en: [
            {
                id: '1',
                time: '08:30-10:05',
                subject: 'Mathematical Analysis',
                type: 'lecture',
                location: 'Building 1, room 101',
                isCurrent: true,
            },
            {
                id: '2',
                time: '10:15-11:50',
                subject: 'English Language',
                type: 'practical class',
                location: 'Building 2, room 205',
                isCurrent: false,
            },
            {
                id: '3',
                time: '12:00-13:35',
                subject: 'Programming Fundamentals',
                type: 'lab work',
                location: 'Building 3, computer lab 301',
                isCurrent: false,
            },
            {
                id: '4',
                time: '14:10-15:45',
                subject: 'History',
                type: 'LMS',
                location: 'Online',
                isCurrent: false,
            },
        ],
        ru: [
            {
                id: '1',
                time: '08:30-10:05',
                subject: 'Математический анализ',
                type: 'lecture',
                location: 'Корпус 1, аудитория 101',
                isCurrent: true,
            },
            {
                id: '2',
                time: '10:15-11:50',
                subject: 'Английский язык',
                type: 'practical class',
                location: 'Корпус 2, аудитория 205',
                isCurrent: false,
            },
            {
                id: '3',
                time: '12:00-13:35',
                subject: 'Основы программирования',
                type: 'lab work',
                location: 'Корпус 3, компьютерный класс 301',
                isCurrent: false,
            },
            {
                id: '4',
                time: '14:10-15:45',
                subject: 'История',
                type: 'LMS',
                location: 'Онлайн',
                isCurrent: false,
            },
        ],
    };

    // Use provided items, API data, or defaults
    let displayItems: ScheduleItem[] = [];
    if (items && items.length > 0) {
        displayItems = items;
    } else if (useApiData && apiSchedule?.items) {
        displayItems = apiSchedule.items;
    } else {
        displayItems = defaultItems[lang] || defaultItems.ru;
    }

    const effectiveTimeZone = timeZone || 'Asia/Novosibirsk';
    const isTodayInTz =
        isSameDayInTimeZone(new Date(), date, effectiveTimeZone) ||
        isSameDayInTimeZone(new Date(), date, 'Europe/Moscow');

    const nowMinutes = isTodayInTz
        ? getNowMinutesInTimeZone(effectiveTimeZone) ?? getNowMinutesInTimeZone('Europe/Moscow')
        : null;

    const computedItems = displayItems.map((item) => {
        if (nowMinutes == null) return { ...item, isCurrent: false };
        const range = parseTimeRangeToMinutes(item.time);
        const isCurrent = range ? nowMinutes >= range.start && nowMinutes <= range.end : false;
        return { ...item, isCurrent };
    });

    const hasCurrent = computedItems.some((item) => item.isCurrent);
    const itemsWithCurrent = hasCurrent ? computedItems : computedItems.map((item) => ({ ...item, isCurrent: false }));

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

    const copy = {
        title: {
            ru: 'Расписание на',
            en: 'Schedule for',
        },
        empty: {
            ru: 'На этот день нет занятий',
            en: 'No classes for this day',
        },
        error: {
            ru: 'Ошибка загрузки расписания',
            en: 'Error loading schedule',
        },
    };

    if (error) {
        return (
            <div className={cn('p-4 bg-red-50 dark:bg-red-900/20 rounded-lg', className)}>
                <p className='text-red-600 dark:text-red-400'>{copy.error[lang]}: {error}</p>
            </div>
        );
    }

    return (
        <div className={cn('p-4', className)}>
            <div className='mb-4'>
                <h3 className='text-xl text-dark-gray dark:text-white sm:text-2xl'>
                    {copy.title[lang]} {date.toLocaleDateString(lang === 'en' ? 'en-US' : 'ru-RU', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                    })}
                </h3>
            </div>

            <div className='flex flex-col gap-3'>
                {itemsWithCurrent.length > 0 ? (
                    itemsWithCurrent.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                'flex flex-col gap-2 rounded-3xl px-4 py-3 transition-colors sm:flex-row sm:items-start sm:justify-between sm:px-6',
                                item.isCurrent
                                    ? 'bg-cyan text-white'
                                    : 'bg-light-blue-gray text-dark-gray dark:bg-surface dark:text-white',
                            )}
                        >
                            <div className='flex-1 space-y-0.26'>
                                <h4 className='text-lg sm:text-2xl'>
                                    {item.subject}
                                </h4>
                                <p className='text-sm opacity-90 sm:text-lg'>
                                    {translateType(item.type, lang)}
                                </p>
                                <p className='text-sm opacity-90 sm:text-lg'>
                                    {item.location}
                                </p>
                            </div>
                            <div className='text-left text-sm whitespace-nowrap sm:text-right sm:text-lg'>
                                {item.time}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-center py-8 text-medium-blue-gray dark:text-gray'>
                        <p>{copy.empty[lang]}</p>
                    </div>
                )}
            </div>
        </div>
    );
}