'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StudentArrivalsChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const fullYearData = [
    { month: 'Январь', international: 32 },
    { month: 'Февраль', international: 38 },
    { month: 'Март', international: 45 },
    { month: 'Апрель', international: 52 },
    { month: 'Май', international: 58 },
    { month: 'Июнь', international: 65 },
    { month: 'Июль', international: 55 },
    { month: 'Август', international: 72 },
    { month: 'Сентябрь', international: 85 },
    { month: 'Октябрь', international: 62 },
    { month: 'Ноябрь', international: 48 },
    { month: 'Декабрь', international: 30 },
  ];

  const [selectedRange, setSelectedRange] = useState('all');
  const [customStart, setCustomStart] = useState(0);
  const [customEnd, setCustomEnd] = useState(11);

  const getChartData = () => {
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white dark:bg-surface p-3 rounded-lg shadow-lg border border-light-blue-gray dark:border-gray'>
          <p className='text-black dark:text-white font-semibold'>{payload[0].payload.month}</p>
          <p style={{ color: payload[0].color }} className='font-semibold'>
            Иностранные студенты: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='bg-white dark:bg-surface rounded-2xl p-8 shadow-lg w-full overflow-hidden'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-black dark:text-white mb-2'>Приезд иностранных студентов по месяцам</h2>
        <p className='text-gray dark:text-medium-warm-gray text-sm'>Статистика приезда иностранных студентов в течение года</p>
      </div>

      {/* Range Selection */}
      <div className='mb-8 p-4 rounded-xl bg-light-blue-gray dark:bg-dark-gray'>
        <p className='text-sm font-semibold text-black dark:text-white mb-4'>Выберите период:</p>
        <div className='flex flex-wrap gap-3 mb-4'>
          <button
            onClick={() => setSelectedRange('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRange === 'all'
                ? 'bg-cyan text-white'
                : 'bg-white dark:bg-surface text-black dark:text-white hover:bg-blue-gray dark:hover:bg-gray'
            }`}
          >
            Весь год
          </button>
          <button
            onClick={() => setSelectedRange('spring')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRange === 'spring'
                ? 'bg-light-green text-white'
                : 'bg-white dark:bg-surface text-black dark:text-white hover:bg-blue-gray dark:hover:bg-gray'
            }`}
          >
            Весна (Март-Май)
          </button>
          <button
            onClick={() => setSelectedRange('summer')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRange === 'summer'
                ? 'bg-yellow text-white'
                : 'bg-white dark:bg-surface text-black dark:text-white hover:bg-blue-gray dark:hover:bg-gray'
            }`}
          >
            Лето (Июнь-Август)
          </button>
          <button
            onClick={() => setSelectedRange('autumn')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRange === 'autumn'
                ? 'bg-light-orange text-white'
                : 'bg-white dark:bg-surface text-black dark:text-white hover:bg-blue-gray dark:hover:bg-gray'
            }`}
          >
            Осень (Сентябрь-Ноябрь)
          </button>
          <button
            onClick={() => setSelectedRange('winter')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRange === 'winter'
                ? 'bg-dark-cyan text-white'
                : 'bg-white dark:bg-surface text-black dark:text-white hover:bg-blue-gray dark:hover:bg-gray'
            }`}
          >
            Зима (Декабрь-Февраль)
          </button>
        </div>

        {/* Custom Range Selection */}
        <div className='flex items-end gap-3'>
          <div className='flex-1'>
            <label className='block text-xs font-semibold text-black dark:text-white mb-2'>От месяца:</label>
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
              {months.map((month, idx) => (
                <option key={idx} value={idx}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className='flex-1'>
            <label className='block text-xs font-semibold text-black dark:text-white mb-2'>До месяца:</label>
            <select
              value={customEnd}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setCustomEnd(val);
                setSelectedRange('custom');
              }}
              className='w-full px-3 py-2 rounded-lg bg-white dark:bg-surface border border-gray dark:border-dark-gray text-black dark:text-white'
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx}>
                  {month}
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
            Применить
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className='mb-8'>
        <div className='p-6 rounded-xl bg-light-blue-gray dark:bg-dark-gray border-l-4 border-light-orange'>
          <p className='text-sm text-gray dark:text-medium-warm-gray mb-2'>Всего иностранных студентов</p>
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
                formatter={(value) => (
                  <span className='text-black dark:text-white'>Иностранные студенты</span>
                )}
              />
              <Bar dataKey='international' fill='#EF6B42' radius={[8, 8, 0, 0]} name='international' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Detailed Statistics */}
      <div className='mt-8 pt-8 border-t border-light-blue-gray dark:border-gray'>
        <p className='text-sm font-semibold text-black dark:text-white mb-4'>Детальная статистика по месяцам:</p>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-light-blue-gray dark:border-gray'>
                <th className='text-left py-2 px-4 font-semibold text-black dark:text-white'>Месяц</th>
                <th className='text-center py-2 px-4 font-semibold text-black dark:text-white'>Иностранные студенты</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, index) => (
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
