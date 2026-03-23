'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Calendar from '@/components/Calendar';
import Schedule from '@/components/Schedule';
import TaskCard from '@/components/Task Card';
import type { ScheduleItem } from '@/components/Schedule';

type TaskStatus = 'completed' | 'in-progress' | 'not completed';

interface Task {
    id: string;
    name: string;
    description: string;
    deadline: string;
    status: TaskStatus;
}

interface StoredStudentAuth {
    username?: string;
    studentId?: string | null;
}

const translations = {
    en: {
        pageTitle: 'Calendar',
        pageSubtitle: 'Manage your schedule and track tasks',
        upcomingTitle: 'Upcoming tasks',
        upcomingSubtitle: 'A list of tasks that require your attention',
    },
    ru: {
        pageTitle: 'Календарь',
        pageSubtitle: 'Управляйте расписанием и отслеживайте задачи',
        upcomingTitle: 'Предстоящие задачи',
        upcomingSubtitle: 'Список задач, которые требуют внимания',
    },
};

const mockWeeklySchedule: Record<'ru' | 'en', Record<number, ScheduleItem[]>> = {
    ru: {
        0: [
            { id: 'sun-1', time: '09:00-10:30', subject: 'Проектное мышление', type: 'lecture', location: 'Онлайн', isCurrent: false },
            { id: 'sun-2', time: '11:00-12:30', subject: 'Академическое письмо', type: 'practical class', location: 'Корпус 2, ауд. 210', isCurrent: false },
            { id: 'sun-3', time: '13:30-15:00', subject: 'Спортивный модуль', type: 'lab work', location: 'Спортзал', isCurrent: false },
        ],
        1: [
            { id: 'mon-1', time: '08:30-10:05', subject: 'Высшая математика', type: 'lecture', location: 'Корпус 1, ауд. 101', isCurrent: false },
            { id: 'mon-2', time: '10:15-11:50', subject: 'Программирование на JavaScript', type: 'lab work', location: 'Лаб. 3-12', isCurrent: false },
            { id: 'mon-3', time: '12:30-14:05', subject: 'История', type: 'lecture', location: 'Корпус 4, ауд. 405', isCurrent: false },
            { id: 'mon-4', time: '14:30-16:05', subject: 'Командный проект', type: 'LMS', location: 'Онлайн', isCurrent: false },
        ],
        2: [
            { id: 'tue-1', time: '09:00-10:30', subject: 'Физика', type: 'lecture', location: 'Корпус 2, ауд. 220', isCurrent: false },
            { id: 'tue-2', time: '11:00-12:30', subject: 'Базы данных', type: 'lab work', location: 'Комп. класс 204', isCurrent: false },
            { id: 'tue-3', time: '13:00-14:30', subject: 'Английский язык', type: 'practical class', location: 'Корпус 1, ауд. 118', isCurrent: false },
        ],
        3: [
            { id: 'wed-1', time: '08:30-10:05', subject: 'Линейная алгебра', type: 'lecture', location: 'Корпус 3, ауд. 309', isCurrent: false },
            { id: 'wed-2', time: '10:15-11:50', subject: 'Теория вероятностей', type: 'practical class', location: 'Корпус 3, ауд. 312', isCurrent: false },
            { id: 'wed-3', time: '12:30-14:05', subject: 'Алгоритмы и структуры данных', type: 'lab work', location: 'Комп. класс 102', isCurrent: false },
        ],
        4: [
            { id: 'thu-1', time: '09:00-10:30', subject: 'Операционные системы', type: 'lecture', location: 'Корпус 1, ауд. 108', isCurrent: false },
            { id: 'thu-2', time: '11:00-12:30', subject: 'Компьютерные сети', type: 'lab work', location: 'Комп. класс 202', isCurrent: false },
            { id: 'thu-3', time: '13:00-14:30', subject: 'Социальная коммуникация', type: 'practical class', location: 'Корпус 2, ауд. 215', isCurrent: false },
        ],
        5: [
            { id: 'fri-1', time: '08:30-10:05', subject: 'Экономика', type: 'lecture', location: 'Корпус 4, ауд. 402', isCurrent: false },
            { id: 'fri-2', time: '10:15-11:50', subject: 'Проектный семинар', type: 'practical class', location: 'Корпус 1, ауд. 120', isCurrent: false },
            { id: 'fri-3', time: '12:30-14:05', subject: 'Тестирование ПО', type: 'lab work', location: 'Комп. класс 105', isCurrent: false },
            { id: 'fri-4', time: '14:30-16:05', subject: 'Подготовка к олимпиаде', type: 'LMS', location: 'Онлайн', isCurrent: false },
        ],
        6: [
            { id: 'sat-1', time: '10:00-11:30', subject: 'Электив по дизайну', type: 'practical class', location: 'Корпус 2, ауд. 206', isCurrent: false },
            { id: 'sat-2', time: '12:00-13:30', subject: 'Data Science вводный', type: 'lecture', location: 'Корпус 3, ауд. 301', isCurrent: false },
            { id: 'sat-3', time: '14:00-15:30', subject: 'UI/UX в LMS', type: 'LMS', location: 'Онлайн', isCurrent: false },
        ],
    },
    en: {
        0: [
            { id: 'sun-1', time: '09:00-10:30', subject: 'Project Thinking', type: 'lecture', location: 'Online', isCurrent: false },
            { id: 'sun-2', time: '11:00-12:30', subject: 'Academic Writing', type: 'practical class', location: 'Building 2, room 210', isCurrent: false },
            { id: 'sun-3', time: '13:30-15:00', subject: 'Sports Module', type: 'lab work', location: 'Gym', isCurrent: false },
        ],
        1: [
            { id: 'mon-1', time: '08:30-10:05', subject: 'Advanced Math', type: 'lecture', location: 'Building 1, room 101', isCurrent: false },
            { id: 'mon-2', time: '10:15-11:50', subject: 'JavaScript Programming', type: 'lab work', location: 'Lab 3-12', isCurrent: false },
            { id: 'mon-3', time: '12:30-14:05', subject: 'History', type: 'lecture', location: 'Building 4, room 405', isCurrent: false },
            { id: 'mon-4', time: '14:30-16:05', subject: 'Team Project', type: 'LMS', location: 'Online', isCurrent: false },
        ],
        2: [
            { id: 'tue-1', time: '09:00-10:30', subject: 'Physics', type: 'lecture', location: 'Building 2, room 220', isCurrent: false },
            { id: 'tue-2', time: '11:00-12:30', subject: 'Databases', type: 'lab work', location: 'Computer lab 204', isCurrent: false },
            { id: 'tue-3', time: '13:00-14:30', subject: 'English Language', type: 'practical class', location: 'Building 1, room 118', isCurrent: false },
        ],
        3: [
            { id: 'wed-1', time: '08:30-10:05', subject: 'Linear Algebra', type: 'lecture', location: 'Building 3, room 309', isCurrent: false },
            { id: 'wed-2', time: '10:15-11:50', subject: 'Probability Theory', type: 'practical class', location: 'Building 3, room 312', isCurrent: false },
            { id: 'wed-3', time: '12:30-14:05', subject: 'Algorithms and Data Structures', type: 'lab work', location: 'Computer lab 102', isCurrent: false },
        ],
        4: [
            { id: 'thu-1', time: '09:00-10:30', subject: 'Operating Systems', type: 'lecture', location: 'Building 1, room 108', isCurrent: false },
            { id: 'thu-2', time: '11:00-12:30', subject: 'Computer Networks', type: 'lab work', location: 'Computer lab 202', isCurrent: false },
            { id: 'thu-3', time: '13:00-14:30', subject: 'Social Communication', type: 'practical class', location: 'Building 2, room 215', isCurrent: false },
        ],
        5: [
            { id: 'fri-1', time: '08:30-10:05', subject: 'Economics', type: 'lecture', location: 'Building 4, room 402', isCurrent: false },
            { id: 'fri-2', time: '10:15-11:50', subject: 'Project Seminar', type: 'practical class', location: 'Building 1, room 120', isCurrent: false },
            { id: 'fri-3', time: '12:30-14:05', subject: 'Software Testing', type: 'lab work', location: 'Computer lab 105', isCurrent: false },
            { id: 'fri-4', time: '14:30-16:05', subject: 'Olympiad Prep', type: 'LMS', location: 'Online', isCurrent: false },
        ],
        6: [
            { id: 'sat-1', time: '10:00-11:30', subject: 'Design Elective', type: 'practical class', location: 'Building 2, room 206', isCurrent: false },
            { id: 'sat-2', time: '12:00-13:30', subject: 'Intro to Data Science', type: 'lecture', location: 'Building 3, room 301', isCurrent: false },
            { id: 'sat-3', time: '14:00-15:30', subject: 'UI/UX in LMS', type: 'LMS', location: 'Online', isCurrent: false },
        ],
    },
};

const normalizeStatus = (value: unknown): TaskStatus => {
    if (typeof value === 'boolean') return value ? 'completed' : 'not completed';
    if (typeof value !== 'string') return 'not completed';
    const normalized = value.trim().toLowerCase();
    if (normalized === 'completed' || normalized === 'done') return 'completed';
    if (normalized === 'in-progress' || normalized === 'in progress') return 'in-progress';
    return 'not completed';
};

const getResponseList = (raw: any): any[] => {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.results)) return raw.results;
    return [];
};

const mapTask = (entry: any, index: number): Task => {
    const taskSource = entry?.task || entry;
    const taskId = taskSource?.id ?? entry?.task_id ?? entry?.id ?? `${index + 1}`;
    const name = taskSource?.name || taskSource?.title || entry?.task_name || entry?.task_title || 'Untitled';
    const description = taskSource?.description || entry?.description || '';
    const rawDeadline = taskSource?.deadline ?? taskSource?.due_date ?? entry?.deadline ?? entry?.due_date ?? null;
    const deadline = rawDeadline ? String(rawDeadline) : '';
    const status = normalizeStatus(entry?.status ?? taskSource?.status ?? entry?.completed ?? taskSource?.completed);

    return {
        id: String(taskId),
        name,
        description,
        deadline,
        status,
    };
};

const parseDeadline = (deadline: string): Date | null => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return Number.isNaN(date.getTime()) ? null : date;
};

const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export default function CalendarPage() {
        const [selectedDate, setSelectedDate] = useState<Date>(new Date());
        const [tasks, setTasks] = useState<Task[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const params = useParams();
        const lang = (params?.lang as 'ru' | 'en') || 'ru';
        const t = translations[lang] || translations.ru;

        useEffect(() => {
            const loadTasks = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const authRaw = localStorage.getItem('studentAuth');
                    if (!authRaw) throw new Error('No stored student session');

                    const auth = JSON.parse(authRaw) as StoredStudentAuth;
                    const username = auth.username?.trim() || '';
                    let studentId = auth.studentId?.toString() || '';

                    if (!studentId && username) {
                        const studentsResponse = await fetch('/api/student/full_info_list');
                        if (!studentsResponse.ok) throw new Error(`Failed to resolve student: ${studentsResponse.status}`);
                        const studentsRaw = await studentsResponse.json();
                        const students = getResponseList(studentsRaw);
                        const matchedStudent = students.find((student: any) =>
                            String(student?.login || '').trim().toLowerCase() === username.toLowerCase()
                        );
                        if (matchedStudent?.id) {
                            studentId = String(matchedStudent.id);
                            localStorage.setItem('studentAuth', JSON.stringify({ username, studentId }));
                        }
                    }

                    if (!studentId) throw new Error('User not identified');

                    const endpointCandidates = [
                        `/api/student_task/student/${studentId}`,
                        `/api//student_task/student/${studentId}`,
                    ];

                    let tasksRaw: any = null;
                    let lastStatus: number | null = null;

                    for (const endpoint of endpointCandidates) {
                        const response = await fetch(endpoint);
                        if (response.ok) {
                            tasksRaw = await response.json();
                            break;
                        }
                        lastStatus = response.status;
                    }

                    if (!tasksRaw) {
                        throw new Error(`Failed to load tasks (${lastStatus ?? 'unknown'})`);
                    }

                    const taskList = getResponseList(tasksRaw).map(mapTask);
                    setTasks(taskList);
                } catch (err) {
                    console.error('Calendar tasks load error:', err);
                    setError(err instanceof Error ? err.message : 'Failed to load tasks');
                } finally {
                    setLoading(false);
                }
            };

            loadTasks();
        }, []);

        const nonCompletedTasks = useMemo(
            () => tasks.filter((task) => task.status !== 'completed'),
            [tasks]
        );

        const tasksWithParsedDeadline = useMemo(
            () =>
                nonCompletedTasks.map((task) => ({
                    ...task,
                    parsedDeadline: parseDeadline(task.deadline),
                })),
            [nonCompletedTasks]
        );

        const scheduleItems = useMemo(() => {
            const week = mockWeeklySchedule[lang] || mockWeeklySchedule.ru;
            return week[selectedDate.getDay()] || [];
        }, [lang, selectedDate]);

        const tasksForSelectedDate = useMemo(
            () =>
                tasksWithParsedDeadline.filter(
                    (task) => task.parsedDeadline && isSameDay(task.parsedDeadline, selectedDate)
                ),
            [tasksWithParsedDeadline, selectedDate]
        );

        const highlightedDates = useMemo(
            () =>
                tasksWithParsedDeadline
                    .map((task) => task.parsedDeadline)
                    .filter((d): d is Date => Boolean(d)),
            [tasksWithParsedDeadline]
        );

        const upcomingTasks = useMemo(() => {
            const source = tasksForSelectedDate.length > 0 ? tasksForSelectedDate : tasksWithParsedDeadline;
            return source
                .slice()
                .sort((a, b) => {
                    const aDate = a.parsedDeadline?.getTime() ?? Infinity;
                    const bDate = b.parsedDeadline?.getTime() ?? Infinity;
                    return aDate - bDate;
                })
                .map(({ parsedDeadline, ...task }) => task);
        }, [tasksForSelectedDate, tasksWithParsedDeadline]);

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
                        highlightedDates={highlightedDates}
                        lang={lang}
                    />
                </div>

                {/* Schedule */}
                <div>
                    <Schedule 
                        date={selectedDate}
                        lang={lang}
                        items={scheduleItems}
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
                    {loading && <p>{t.pageSubtitle}</p>}
                    {error && <p className='text-dark-orange'>{error}</p>}
                    {!loading && !error && upcomingTasks.map((task) => (
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
