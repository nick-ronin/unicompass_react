'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function StudentArrivalsChart() {
  const params = useParams();
  const lang = (params?.lang as 'ru' | 'en') || 'ru';

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [arrivals, setArrivals] = useState<Array<{ month: string; arrivals: number }>>([]);
  const [monthsCount, setMonthsCount] = useState(12);
  const [selectedRange, setSelectedRange] = useState<'all' | 'spring' | 'summer' | 'autumn' | 'winter' | 'custom'>('all');
  const [customStart, setCustomStart] = useState(0);
  const [customEnd, setCustomEnd] = useState(11);

  const translations = {
    ru: {
      loading: 'Загружаем данные...',
      error: 'Не удалось загрузить статистику',
      title: 'Прибытие иностранных студентов по месяцам',
      subtitle: 'Статистика прибытия иностранных студентов за период',
      selectPeriod: 'Выберите период:',
      fullYear: 'Весь год',
      spring: 'Весна (март-май)',
      summer: 'Лето (июнь-август)',
      autumn: 'Осень (сентябрь-ноябрь)',
      winter: 'Зима (декабрь-февраль)',
      apply: 'Применить',
      allStudents: 'Всего иностранных студентов',
      detailed: 'Детальная помесячная статистика:',
      month: 'Месяц',
      international: 'Иностранные студенты',
      tooltipLabel: 'Иностранные студенты:',
      months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    },
    en: {
      loading: 'Loading arrivals...',
      error: 'Failed to load arrivals',
      title: 'Arrival of international students by month',
      subtitle: 'Arrival statistics for international students for the period',
      selectPeriod: 'Select period:',
      fullYear: 'Full year',
      spring: 'Spring (March-May)',
      summer: 'Summer (June-August)',
      autumn: 'Autumn (September-November)',
      winter: 'Winter (December-February)',
      apply: 'Apply',
      allStudents: 'Total international students',
      detailed: 'Detailed monthly statistics:',
      month: 'Month',
      international: 'International students',
      tooltipLabel: 'International students:',
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    },
  };

  const t = translations[lang] || translations.ru;

  useEffect(() => {
    setMounted(true);
  }, []);

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

        const res = await fetch(`/api/trip/analytics/arrivals?months=${monthsCount}&end=2026-10`, {
          headers: { ...authHeaders },
        });
        if (!res.ok) throw new Error(`Failed to load arrivals: ${res.status}`);
        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data : [];

        setArrivals(
          data.map((item: any) => ({
            month: typeof item?.month === 'string' ? item.month : '',
            arrivals: Number(item?.arrivals) || 0,
          }))
        );
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : t.error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [monthsCount, t.error]);

  const fullYearData = useMemo(() => {
    return arrivals.map((item) => {
      const [year, monthNum] = item.month.split('-');
      const idx = Number(monthNum) - 1;
      const monthName = t.months[idx] || item.month;
      const display = year ? `${monthName} ${year}` : monthName;
      return { month: display, international: item.arrivals };
    });
  }, [arrivals, t.months]);

  useEffect(() => {
    if (!fullYearData.length) {
      setCustomStart(0);
      setCustomEnd(0);
      return;
    }
    setCustomStart((prev) => Math.min(prev, fullYearData.length - 1));
    setCustomEnd((prev) => Math.min(prev, fullYearData.length - 1));
  }, [fullYearData.length]);

  const getChartData = () => {
    if (!fullYearData.length) return [];

    if (selectedRange === 'all') {
      return fullYearData;
    } else if (selectedRange === 'spring') {
      return fullYearData.slice(2, 5);
    } else if (selectedRange === 'summer') {
      return fullYearData.slice(5, 8);
    } else if (selectedRange === 'autumn') {
      return fullYearData.slice(8, 11);
    } else if (selectedRange === 'winter') {
      return [...fullYearData.slice(11), ...fullYearData.slice(0, 2)];
    } else if (selectedRange === 'custom') {
      return fullYearData.slice(customStart, customEnd + 1);
    }
    return fullYearData;
  };

  const chartData = getChartData();
  const totalInternational = chartData.reduce((sum, item) => sum + item.international, 0);
  const tableData = chartData.filter((item) => item.international > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white dark:bg-surface p-3 rounded-lg shadow-lg border border-light-blue-gray dark:border-gray'>
          <p className='text-black dark:text-white font-semibold'>{payload[0].payload.month}</p>
          <p style={{ color: payload[0].color }} className='font-semibold'>
            {t.tooltipLabel} {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const monthOptions = fullYearData.length ? fullYearData : t.months.map((m) => ({ month: m, international: 0 }));

  return (
    <div className='bg-white dark:bg-surface rounded-2xl p-8 shadow-lg w-full overflow-hidden'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-black dark:text-white mb-2'>{t.title}</h2>
        <p className='text-gray dark:text-medium-warm-gray text-sm'>{t.subtitle}</p>
      </div>

      {/* Range Selection */}
      <div className='mb-8 p-4 rounded-xl bg-light-blue-gray dark:bg-dark-gray'>
        <p className='text-sm font-semibold text-black dark:text-white mb-4'>{t.selectPeriod}</p>
        <div className='flex flex-wrap gap-3 mb-4'>
          <button
            onClick={() => setSelectedRange('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRange === 'all'
                ? 'bg-cyan text-white'
                : 'bg-white dark:bg-surface text-black dark:text-white hover:bg-blue-gray dark:hover:bg-gray'
            }`}
          >
            {t.fullYear}
          </button>
          <button
            onClick={() => setSelectedRange('spring')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRange === 'spring'
                ? 'bg-light-green text-white'
                : 'bg-white dark:bg-surface text-black dark:text-white hover:bg-blue-gray dark:hover:bg-gray'
            }`}
          >
            {t.spring}
          </button>
          <button
            onClick={() => setSelectedRange('summer')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRange === 'summer'
                ? 'bg-yellow text-white'
                : 'bg-white dark:bg-surface text-black dark:text-white hover:bg-blue-gray dark:hover:bg-gray'
            }`}
          >
            {t.summer}
          </button>
          <button
            onClick={() => setSelectedRange('autumn')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRange === 'autumn'
                ? 'bg-light-orange text-white'
                : 'bg-white dark:bg-surface text-black dark:text-white hover:bg-blue-gray dark:hover:bg-gray'
            }`}
          >
            {t.autumn}
          </button>
          <button
            onClick={() => setSelectedRange('winter')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRange === 'winter'
                ? 'bg-dark-cyan text-white'
                : 'bg-white dark:bg-surface text-black dark:text-white hover:bg-blue-gray dark:hover:bg-gray'
            }`}
          >
            {t.winter}
          </button>
        </div>

        <div className='flex items-center gap-3 mt-4 flex-wrap'>
          <label className='text-sm font-semibold text-black dark:text-white'>{lang === 'en' ? 'Months:' : 'Месяцев:'}</label>
          <select
            value={monthsCount}
            onChange={(e) => setMonthsCount(Number(e.target.value) || 12)}
            className='px-3 py-2 rounded-lg bg-white dark:bg-surface border border-gray dark:border-dark-gray text-black dark:text-white'
          >
            {[3, 6, 9, 12, 18, 24].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {loading && <span className='text-xs text-gray dark:text-medium-warm-gray'>{t.loading}</span>}
          {error && <span className='text-xs text-red-500'>{t.error}: {error}</span>}
        </div>

        {/* Custom Range Selection */}
        <div className='flex items-end gap-3 mt-4'>
          <div className='flex-1'>
            <label className='block text-xs font-semibold text-black dark:text-white mb-2'>{lang === 'en' ? 'From month:' : 'С месяца:'}</label>
            <select
              value={customStart}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setCustomStart(val);
                if (val > customEnd) setCustomEnd(val);
                setSelectedRange('custom');
              }}
              className='w-full px-3 py-2 rounded-lg bg-white dark:bg-surface border border-gray dark:border-dark-gray text-black dark:text-white'
            >
              {monthOptions.map((item, idx) => (
                <option key={idx} value={idx}>
                  {item.month}
                </option>
              ))}
            </select>
          </div>
          <div className='flex-1'>
            <label className='block text-xs font-semibold text-black dark:text-white mb-2'>{lang === 'en' ? 'To month:' : 'По месяц:'}</label>
            <select
              value={customEnd}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setCustomEnd(val);
                setSelectedRange('custom');
              }}
              className='w-full px-3 py-2 rounded-lg bg-white dark:bg-surface border border-gray dark:border-dark-gray text-black dark:text-white'
            >
              {monthOptions.map((item, idx) => (
                <option key={idx} value={idx}>
                  {item.month}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setSelectedRange('custom')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              selectedRange === 'custom'
                ? 'bg-orange text-white'
                : 'bg-white dark:bg-surface text-black dark:text-white hover:bg-blue-gray dark:hover:bg-gray'
            }`}
          >
            {t.apply}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className='mb-8'>
        <div className='p-6 rounded-xl bg-light-blue-gray dark:bg-dark-gray border-l-4 border-light-orange'>
          <p className='text-sm text-gray dark:text-medium-warm-gray mb-2'>{t.allStudents}</p>
          <p className='text-4xl font-bold text-light-orange'>{totalInternational}</p>
        </div>
      </div>

      {/* Chart */}
      {mounted && (
        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
              <XAxis dataKey='month' stroke='#6b7280' style={{ fontSize: '12px' }} />
              <YAxis stroke='#6b7280' style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={() => <span className='text-black dark:text-white'>{t.international}</span>}
              />
              <Bar dataKey='international' fill='#EF6B42' radius={[8, 8, 0, 0]} name={t.international} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Detailed Statistics */}
      <div className='mt-8 pt-8 border-t border-light-blue-gray dark:border-gray'>
        <p className='text-sm font-semibold text-black dark:text-white mb-4'>{t.detailed}</p>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-light-blue-gray dark:border-gray'>
                <th className='text-left py-2 px-4 font-semibold text-black dark:text-white'>{t.month}</th>
                <th className='text-center py-2 px-4 font-semibold text-black dark:text-white'>{t.international}</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr
                  key={index}
                  className='border-b border-light-blue-gray dark:border-gray hover:bg-light-blue-gray dark:hover:bg-dark-gray'
                >
                  <td className='py-3 px-4 text-black dark:text-white font-medium'>{item.month}</td>
                  <td className='text-center py-3 px-4 text-light-orange font-semibold'>{item.international}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}