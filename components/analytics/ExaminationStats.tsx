'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ExaminationStatsProps {
  type?: 'fingerprint' | 'medical';
}

export default function ExaminationStats({ type = 'fingerprint' }: ExaminationStatsProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<{ completed: number; notCompleted: number; total: number } | null>(null);
  const params = useParams();
  const lang = (params?.lang as 'ru' | 'en') || 'ru';

  const translations = {
    ru: {
      titleFingerprint: 'Дактилоскопия',
      titleMedical: 'Медосмотр',
      subtitleFingerprint: 'Статус прохождения дактилоскопии студентами',
      subtitleMedical: 'Статус прохождения медосмотра студентами',
      completed: 'Выполнено',
      inProgress: 'В процессе',
      notStarted: 'Не начато',
      replay: 'В процессе',
      assigned: 'Назначено',
    },
    en: {
      titleFingerprint: 'Fingerprinting',
      titleMedical: 'Medical examination',
      subtitleFingerprint: 'Status of students undergoing fingerprinting',
      subtitleMedical: 'Status of students passing a medical exam',
      completed: 'Completed',
      inProgress: 'In progress',
      notStarted: 'Not started',
      replay: 'In progress',
      assigned: 'Assigned',
    },
  };

  const t = translations[lang] || translations.ru;

  useEffect(() => {
    setMounted(true);
  }, []);

  const normalizePercent = (value: number, total: number) => {
    if (!total) return 0;
    return Number(((value / total) * 100).toFixed(2));
  };

  const data = useMemo(() => {
    if (!analytics) {
      return [
        { name: t.completed, value: 0, color: '#06B6D4' },
        { name: t.inProgress, value: 0, color: '#F59E0B' },
        { name: type === 'fingerprint' ? t.notStarted : t.assigned, value: 0, color: '#EF6B42' },
      ];
    }

    const completed = normalizePercent(analytics.completed, analytics.total || analytics.completed + analytics.notCompleted);
    const notCompleted = normalizePercent(analytics.notCompleted, analytics.total || analytics.completed + analytics.notCompleted);
    const inProgressRaw = Math.max((analytics.total || analytics.completed + analytics.notCompleted) - analytics.completed - analytics.notCompleted, 0);
    const inProgress = normalizePercent(inProgressRaw, analytics.total || analytics.completed + analytics.notCompleted || 1);

    return [
      { name: t.completed, value: completed, color: '#06B6D4' },
      { name: t.inProgress, value: inProgress, color: '#F59E0B' },
      { name: type === 'fingerprint' ? t.notStarted : t.assigned, value: notCompleted, color: '#EF6B42' },
    ];
  }, [analytics, t.completed, t.inProgress, t.notStarted, t.assigned, type]);
  const title = type === 'fingerprint' ? t.titleFingerprint : t.titleMedical;
  const subtitle = type === 'fingerprint' ? t.subtitleFingerprint : t.subtitleMedical;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('jwt') || localStorage.getItem('accessToken') || localStorage.getItem('token')
            : null;
        const authHeaders: Record<string, string> = {};
        if (token) authHeaders.Authorization = `Bearer ${token}`;

      const tasksRes = await fetch('/api/task', { headers: { ...authHeaders } });
        if (!tasksRes.ok) throw new Error(`Failed to load tasks: ${tasksRes.status}`);
        const rawTasks = await tasksRes.json();
        const tasks = Array.isArray(rawTasks) ? rawTasks : rawTasks.results || rawTasks.data || [];

        const matchNames = type === 'fingerprint' ? ['пройти дактилоскопию', 'Fingerprint'] : ['Медосмотр', 'Medical'];
        const matched = tasks.find((task: any) => {
          const name = (task.name || task.title || '').toString();
          return matchNames.some((m) => name.toLowerCase().includes(m.toLowerCase()));
        });

        if (!matched?.id) {
          throw new Error('Не найдена задача для графика');
        }

        const analyticsRes = await fetch(`/api/student_task/analytics/task/${matched.id}`, {
          headers: { ...authHeaders },
        });
        if (!analyticsRes.ok) throw new Error(`Failed to load analytics: ${analyticsRes.status}`);
        const analyticsData = await analyticsRes.json();

        setAnalytics({
          completed: Number(analyticsData?.completed) || 0,
          notCompleted: Number(analyticsData?.not_completed) || 0,
          total: Number(analyticsData?.total_assigned) || 0,
        });
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Analytics load error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [type]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white dark:bg-surface p-3 rounded-lg shadow-lg border border-light-blue-gray dark:border-gray'>
          <p className='text-black dark:text-white font-semibold'>{payload[0].name}</p>
          <p className='text-black dark:text-white'>
            <span className='font-bold'>{payload[0].value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='bg-white dark:bg-surface rounded-2xl p-8 shadow-lg w-full overflow-hidden'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-black dark:text-white mb-2'>{title}</h2>
        <p className='text-gray dark:text-medium-warm-gray text-sm'>
          {subtitle}
        </p>
      </div>

      {mounted && (
        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={({ name, value }) => (value === 0 ? '' : `${name}: ${value}%`)}
                outerRadius={100}
                fill='#8884d8'
                dataKey='value'
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign='bottom'
                height={36}
                formatter={(value, entry) => (
                  <span className='text-black dark:text-white'>{(entry.payload as any).name}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Statistics grid */}
      <div className='grid grid-cols-3 gap-4 mt-8'>
        {data.map((item, index) => (
          <div key={index} className='p-4 rounded-xl bg-light-blue-gray dark:bg-dark-gray'>
            <div className='flex items-center gap-2 mb-2'>
              <div className='w-3 h-3 rounded-full' style={{ backgroundColor: item.color }} />
              <p className='text-sm font-semibold text-black dark:text-white'>{item.name}</p>
            </div>
            <p className='text-3xl font-bold text-black dark:text-white'>{item.value}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
