'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Dropdown from './Dropdown';
import Button from './Button';
import { useUpdateTask } from '@/lib/hooks';
import { Task } from '@/lib/types';

type TaskStatus = Task['status'];

interface TaskCardProps {
    name: string;
    description: string;
    deadline: string;
    status?: TaskStatus;
    color?: string;
    className?: string;
    id?: string;
    onStatusChange?: (newStatus: TaskStatus) => void;
    lang?: 'ru' | 'en';
}

const statusConfigMap: Record<TaskStatus, { bg: string; border: string; icon: string; accent: string }> = {
    'completed': { 
        bg: 'bg-gradient-to-br from-light-green via-cyan to-dark-cyan', 
        border: 'border-l-4 border-light-green',
        icon: 'check_circle',
        accent: 'text-white'
    },
    'in-progress': { 
        bg: 'bg-gradient-to-br from-dark-yellow via-yellow to-yellow', 
        border: 'border-l-4 border-yellow',
        icon: 'schedule',
        accent: 'text-white'
    },
    'not completed': { 
        bg: 'bg-gradient-to-br from-light-orange via-orange to-dark-orange', 
        border: 'border-l-4 border-orange',
        icon: 'circle',
        accent: 'text-white'
    },
};

export default function TaskCard({ 
    name, 
    description, 
    deadline, 
    status = 'not completed', 
    color, 
    className,
    id,
    onStatusChange,
    lang = 'ru'
}: TaskCardProps) {
    const translations = {
        ru: {
            labels: {
                completed: 'Выполнено',
                inProgress: 'В процессе',
                notCompleted: 'Не выполнено',
            },
            deadline: {
                overdue: 'Просрочено',
                today: 'Сегодня',
                tomorrow: 'Завтра',
                days: (n: number) => `${n} дн.`,
                none: 'Без дедлайна',
            },
            confirm: 'Подтвердить',
        },
        en: {
            labels: {
                completed: 'Completed',
                inProgress: 'In progress',
                notCompleted: 'Not completed',
            },
            deadline: {
                overdue: 'Overdue',
                today: 'Today',
                tomorrow: 'Tomorrow',
                days: (n: number) => `${n} days`,
                none: 'No deadline',
            },
            confirm: 'Confirm',
        },
    };

    const t = translations[lang] || translations.ru;
    const [currentStatus, setCurrentStatus] = useState<TaskStatus>(status);
    const [isHovered, setIsHovered] = useState(false);
    const { updateTask } = useUpdateTask(id || '');

    const statusLabelMap: Record<TaskStatus, string> = {
        'completed': t.labels.completed,
        'in-progress': t.labels.inProgress,
        'not completed': t.labels.notCompleted,
    };

    const toStatusValue = (option: string): TaskStatus => {
        const normalized = option.trim().toLowerCase();
        if (normalized === t.labels.completed.toLowerCase()) return 'completed';
        if (normalized === t.labels.inProgress.toLowerCase()) return 'in-progress';
        return 'not completed';
    };

    useEffect(() => {
        setCurrentStatus(status);
    }, [status]);

    const handleStatusChange = async (option: string) => {
        const mapped = toStatusValue(option);
        setCurrentStatus(mapped);
        if (id) {
            try {
                await updateTask({ status: mapped as Task['status'] });
                onStatusChange?.(mapped);
            } catch (err) {
                console.error('Failed to update task status:', err);
                setCurrentStatus(status);
            }
        }
    };

    // Calculate days until deadline
    const getDeadlineInfo = () => {
        if (!deadline) {
            return { text: t.deadline.none, badge: 'bg-white bg-opacity-30 text-white' };
        }

        const deadlineDate = new Date(deadline);
        if (Number.isNaN(deadlineDate.getTime())) {
            return { text: t.deadline.none, badge: 'bg-white bg-opacity-30 text-white' };
        }

        const today = new Date();
        const timeDiff = deadlineDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (daysDiff < 0) return { text: t.deadline.overdue, badge: 'bg-dark-red text-white' };
        if (daysDiff === 0) return { text: t.deadline.today, badge: 'bg-orange text-white' };
        if (daysDiff === 1) return { text: t.deadline.tomorrow, badge: 'bg-yellow text-white' };
        if (daysDiff <= 7) return { text: t.deadline.days(daysDiff), badge: 'bg-orange text-white' };
        return { text: t.deadline.days(daysDiff), badge: 'bg-white bg-opacity-30 text-white' };
    };

    const formattedDeadline = (() => {
        if (!deadline) return t.deadline.none;

        const date = new Date(deadline);
        if (Number.isNaN(date.getTime())) return deadline;

        const locale = lang === 'en' ? 'en-US' : 'ru-RU';
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    })();

    const deadlineInfo = getDeadlineInfo();
    const config = statusConfigMap[currentStatus];

    return (
        <div 
            className={cn(
                'relative group rounded-2xl shadow-lg transition-all duration-300 cursor-pointer h-100 flex flex-col',
                'hover:shadow-2xl hover:scale-105 dark:hover:shadow-xl',
                config.bg,
                config.border,
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={color ? { borderLeftColor: color } : undefined}
        >
            {/* Background Pattern */}
            <div className='absolute inset-0 opacity-10 overflow-hidden rounded-2xl'>
                <div className='absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20'></div>
                <div className='absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16'></div>
            </div>

            {/* Content */}
            <div className='relative z-10 flex flex-col h-full p-6'>
                {/* Header */}
                <div className='flex items-start justify-between mb-3'>
                    <div className='flex-1'>
                        <h3 className='text-xl font-bold text-white mb-1 line-clamp-2'>
                            {name}
                        </h3>
                        <div className='flex items-center gap-2'>
                            <span className={cn('material-symbols-outlined text-lg', config.accent)}>
                                {config.icon}
                            </span>
                            <span className='text-xs font-semibold text-white opacity-90'>
                                {statusLabelMap[currentStatus]}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className='text-sm text-white opacity-90 mb-4 line-clamp-2 grow'>
                    {description}
                </p>

                {/* Spacer */}
                <div className='grow'></div>

                {/* Deadline Info */}
                <div className='flex items-center justify-between mb-4 px-3 py-2'>
                    <div className='flex items-center gap-2'>
                        <span className='material-symbols-outlined text-base text-white'>calendar_today</span>
                        <span className='text-xs text-white opacity-80'>{formattedDeadline}</span>
                    </div>
                    <span className={cn('text-xs font-bold px-3 py-1 rounded-full', deadlineInfo.badge)}>
                        {deadlineInfo.text}
                    </span>
                </div>

                {/* Status Dropdown */}
                <Dropdown
                    options={[t.labels.completed, t.labels.inProgress, t.labels.notCompleted]}
                    onSelect={handleStatusChange}
                    defaultValue={statusLabelMap[currentStatus]}
                    lang={lang}
                    className='w-full text-black text-sm mb-3'
                />

                {/* Action Button */}
                {currentStatus === 'completed' && (
                    <Button 
                        className='bg-white text-dark-gray hover:bg-light-blue-gray self-start w-full font-semibold shadow-lg transition-all' 
                        icon={<span className='material-symbols-outlined'>check</span>}
                    >
                        {t.confirm}
                    </Button>
                )}
            </div>

            {/* Hover Effect Border */}
            {isHovered && (
                <div className='absolute inset-0 border-2 border-white opacity-30 rounded-2xl pointer-events-none'></div>
            )}
        </div>
    );
}