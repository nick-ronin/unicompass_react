'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ExaminationStatsProps {
  type?: 'fingerprint' | 'medical';
}

export default function ExaminationStats({ type = 'fingerprint' }: ExaminationStatsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data for fingerprinting
  const fingerprintData = [
    { name: 'Завершено', value: 72, color: '#06B6D4' }, // cyan
    { name: 'В процессе', value: 18, color: '#F59E0B' }, // yellow
    { name: 'Не начато', value: 10, color: '#EF6B42' }, // orange
  ];

  // Mock data for medical examination
  const medicalData = [
    { name: 'Завершено', value: 65, color: '#06B6D4' }, // cyan
    { name: 'Требуется повтор', value: 22, color: '#F59E0B' }, // yellow
    { name: 'Назначено', value: 13, color: '#EF6B42' }, // orange
  ];

  const data = type === 'fingerprint' ? fingerprintData : medicalData;
  const title = type === 'fingerprint' ? 'Дактилоскопия' : 'Медосмотр';

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
        <h2 className='text-2xl font-bold text-black dark:text-white mb-2'>Статистика {title.toLowerCase()}</h2>
        <p className='text-gray dark:text-medium-warm-gray text-sm'>
          {type === 'fingerprint'
            ? 'Статус прохождения дактилоскопии студентами'
            : 'Статус прохождения медицинского осмотра студентами'}
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
                label={({ name, value }) => `${name}: ${value}%`}
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
