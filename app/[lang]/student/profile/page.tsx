'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '@/components/Button';
import InputField from '@/components/Input Field';
import Document from '@/components/Document';
import Trip from '@/components/Trip';

const leftFields = {
  address: "Адрес проживания",
  citizenship: "Гражданство",
  passport: "Номер паспорта",
  snils: "СНИЛС",
  inn: "ИНН"
};

const rightFields = {
  date_of_birth: "Дата рождения",
  email: "Электронная почта",
  sfu_email: "Электронная почта СФУ",
  phone_home: "Номер телефона родной страны",
  phone_rf: "Номер телефона РФ"
};

export default function ProfilePage() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetch('https://159.194.196.47:8000/student/2')
      .then(res => res.json())
      .then(data => setStudent(data))
      .catch(err => console.error(err));
  }, []);

  if (!student) return <p className='text-dark-gray dark:text-white'>Загрузка данных...</p>;

  return (
    <div className='px-48 pb-8 gap-24 flex flex-col'>
      {/* Краткая информация */}
      <div>
        <div className='flex flex-row gap-4 items-center mt-8'>
          <Image src='/NoAvatarDefault.svg' width={64} height={64} alt='Avatar' />
          <div className='flex flex-col'>
            <p className='text-2xl font-extrabold text-dark-gray dark:text-white'>
              {student.last_name || ''} {student.first_name || ''} {student.patronymic || ''}
            </p>
            <p className='text-lg text-dark-gray dark:text-white'>Курс: 1, ИКИТ, КИ26-14Б</p>
          </div>
        </div>

        {/* Поля для редактирования */}
        <div className='flex flex-col'>
          <div className='flex justify-end'>
            <Button className='bg-orange text-white hover:bg-dark-orange text-lg dark:bg-orange dark:hover:bg-dark-orange' icon={<span className='material-symbols-outlined'>edit</span>}>
              Редактировать
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className='flex flex-col gap-4'>
              {Object.entries(leftFields).map(([key, label]) => (
                <div key={key}>
                  <p className="text-lg px-4 text-dark-gray dark:text-white">{label}</p>
                  <InputField placeholder={label} className="w-full text-lg" value={student[key] || ''} />
                </div>
              ))}
            </div>

            <div className='flex flex-col gap-4'>
              {Object.entries(rightFields).map(([key, label]) => (
                <div key={key}>
                  <p className="text-lg px-4 text-dark-gray dark:text-white">{label}</p>
                  <InputField placeholder={label} className="w-full text-lg" value={student[key] || ''} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Документы */}
      <div className='flex flex-col gap-8'>
        <p className='text-2xl font-extrabold text-dark-gray dark:text-white'>Мои документы</p>
        <div className='grid grid-cols-4 col-span-4 gap-8 justify-center items-center'>
          <Document name='ИНН' image={<Image src='/img/doc1.png' width={240} height={340} alt='Document' className='object-fill' />} />
          <Document name='СНИЛС' image={<Image src='/img/doc3.png' width={240} height={340} alt='Document' className='object-fill' />} />
          <Document name='Паспорт' image={<Image src='/img/doc2.png' width={240} height={340} alt='Document' className='object-fill' />} />
          <Document name='Виза' image={<Image src='/img/doc5.png' width={240} height={340} alt='Document' className='object-fill' />} />
          <Document name='Аттестат' image={<Image src='/img/doc4.png' width={240} height={340} alt='Document' className='object-fill' />} />
          <Document name='Справка' image={<Image src='/img/doc6.jpg' width={240} height={340} alt='Document' className='object-fill' />} />
          <div className='flex items-center justify-center w-[264]'>
            <Button className='bg-cyan text-white hover:bg-dark-cyan dark:bg-cyan dark:hover:bg-dark-cyan px-4 py-4 rounded-full' icon={<span className='material-symbols-outlined'>add</span>} />
          </div>
        </div>
      </div>

      {/* Поездки */}
      <div className='flex flex-col gap-8'>
        <div className='flex flex-row justify-between items-center'>
          <p className='text-2xl font-extrabold text-dark-gray dark:text-white'>Мои поездки</p>
          <Button className='bg-cyan text-white hover:bg-dark-cyan dark:bg-cyan dark:hover:bg-dark-cyan text-lg' icon={<span className='material-symbols-outlined'>add</span>}>
            Добавить поездку
          </Button>
        </div>
        <div className='flex flex-col gap-4'>
          <Trip from='Алматы' to='Красноярск' date='29.08.2026' />
          <Trip from='Москва' to='Санкт-Петербург' date='30.08.2026' />
          <Trip from='Казань' to='Нижний Новгород' date='31.08.2026' />
        </div>
      </div>
    </div>
  );
}