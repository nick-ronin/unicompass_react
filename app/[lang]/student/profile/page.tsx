'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/Button';
import InputField from '@/components/Input Field';
import Document from '@/components/Document';
import Trip from '@/components/Trip';

interface Student {
  first_name: string;
  last_name: string;
  patronymic: string;
  address: string;
  citizenship: string;
  passport: string;
  snils: string;
  inn: string;
  date_of_birth: string;
  email: string;
  sfu_email: string;
  phone_home: string;
  phone_rf: string;
}

const translations = {
  ru: {
    address: 'Адрес проживания',
    citizenship: 'Гражданство',
    passport: 'Номер паспорта',
    snils: 'СНИЛС',
    inn: 'ИНН',
    date_of_birth: 'Дата рождения',
    email: 'Email',
    sfu_email: 'Email СФУ',
    phone_home: 'Телефон на родине',
    phone_rf: 'Телефон в РФ',
    loading: 'Загрузка профиля...',
    edit: 'Редактировать',
    save: 'Сохранить',
    saving: 'Сохранение...',
    cancel: 'Отмена',
    documents: 'Мои документы',
    trips: 'Мои поездки',
    addTrip: 'Добавить поездку',
    headingStub: 'Курс: 1, ИКИТ, ЦИ26-14Б',
    docNames: ['ИНН', 'СНИЛС', 'Паспорт', 'Виза', 'Справка', 'Заявление'],
    addDoc: 'Добавить документ',
    profileError: 'Не удалось загрузить профиль.',
    saveError: 'Не удалось сохранить профиль.',
    notFound: 'Профиль текущего пользователя не найден.',
  },
  en: {
    address: 'Residential address',
    citizenship: 'Citizenship',
    passport: 'Passport number',
    snils: 'SNILS',
    inn: 'TIN',
    date_of_birth: 'Date of birth',
    email: 'Email',
    sfu_email: 'Siberian Federal University email',
    phone_home: 'Home-country phone number',
    phone_rf: 'Russian phone number',
    loading: 'Loading profile...',
    edit: 'Edit',
    save: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    documents: 'My documents',
    trips: 'My trips',
    addTrip: 'Add trip',
    headingStub: 'Year 1, ICIT, CI26-14B',
    docNames: ['TIN', 'SNILS', 'Passport', 'Visa', 'Certificate', 'Statement'],
    addDoc: 'Add document',
    profileError: 'Failed to load profile.',
    saveError: 'Failed to save profile.',
    notFound: 'Current user profile not found.',
  },
};

const leftFields = (t: typeof translations.en) => ({
  address: t.address,
  citizenship: t.citizenship,
  passport: t.passport,
  snils: t.snils,
  inn: t.inn,
});

const rightFields = (t: typeof translations.en) => ({
  date_of_birth: t.date_of_birth,
  email: t.email,
  sfu_email: t.sfu_email,
  phone_home: t.phone_home,
  phone_rf: t.phone_rf,
});

export default function ProfilePage() {
  const params = useParams();
  const langParam = typeof params.lang === 'string' ? params.lang : Array.isArray(params.lang) ? params.lang[0] : 'ru';
  const t = translations[langParam as keyof typeof translations] || translations.ru;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editableStudent, setEditableStudent] = useState<Student | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  const handleEditClick = () => {
    setEditableStudent(student);
    setIsEditing(true);
    setSaveError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditableStudent(null);
    setSaveError(null);
  };

  const handleFieldChange = (field: keyof Student, value: string) => {
    if (editableStudent) {
      setEditableStudent({
        ...editableStudent,
        [field]: value,
      });
    }
  };

  const handleSave = async () => {
    if (!editableStudent || !studentId) return;

    try {
      setIsSaving(true);
      setSaveError(null);

      const payload = {
        first_name: editableStudent.first_name,
        last_name: editableStudent.last_name,
        patronymic: editableStudent.patronymic,
        citizenship: editableStudent.citizenship,
        address: editableStudent.address,
        date_of_birth: editableStudent.date_of_birth,
        passport: editableStudent.passport,
        email: editableStudent.email,
        phone_number: editableStudent.phone_rf,
      };

      const response = await fetch(`/api/student/full_patch/${studentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
          errorData.message ||
          `Error while saving: ${response.status}`
        );
      }

      setStudent(editableStudent);
      setIsEditing(false);
      setEditableStudent(null);
    } catch (err) {
      console.error('Error while saving profile:', err);
      setSaveError(
        err instanceof Error ? err.message : t.saveError
      );
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const loadCurrentStudentProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedAuthRaw = localStorage.getItem('studentAuth');
        if (!storedAuthRaw) {
          throw new Error(langParam === 'en' ? 'No active user found. Please sign in again.' : 'Пользователь не найден. Выполните вход повторно.');
        }

        const storedAuth = JSON.parse(storedAuthRaw) as { username?: string; studentId?: string | null };
        const normalizedUsername = storedAuth.username?.trim().toLowerCase() || '';
        const storedStudentId = storedAuth.studentId?.toString() || '';

        let profileSource: any = null;

        if (storedStudentId) {
          const byIdResponse = await fetch(`/api/student/${storedStudentId}`);
          if (byIdResponse.ok) {
            profileSource = await byIdResponse.json();
          }
        }

        if (!profileSource) {
          const listResponse = await fetch('/api/student/full_info_list');
          if (!listResponse.ok) {
            throw new Error(`Error loading profile: ${listResponse.status}`);
          }

          const listData = await listResponse.json();
          const students = Array.isArray(listData) ? listData : listData.results || [];

          profileSource = students.find((item: any) => {
            const itemLogin = String(item.login || '').trim().toLowerCase();
            const itemId = item.id?.toString() || '';
            return (normalizedUsername && itemLogin === normalizedUsername) || (storedStudentId && itemId === storedStudentId);
          });
        }

        if (!profileSource) {
          throw new Error(t.notFound);
        }

        setStudent({
          first_name: profileSource.first_name || '',
          last_name: profileSource.last_name || '',
          patronymic: profileSource.patronymic || '',
          address: profileSource.address || '',
          citizenship: profileSource.citizenship || '',
          passport: profileSource.passport || '',
          snils: profileSource.snils || '',
          inn: profileSource.inn || '',
          date_of_birth: profileSource.date_of_birth || '',
          email: profileSource.email || '',
          sfu_email: profileSource.sfu_email || '',
          phone_home: profileSource.phone_home || '',
          phone_rf: profileSource.phone_rf || profileSource.phone_number || '',
        });

        if (profileSource.id) {
          const idString = String(profileSource.id);
          localStorage.setItem(
            'studentAuth',
            JSON.stringify({
              username: storedAuth.username || profileSource.login || '',
              studentId: idString,
            })
          );
          setStudentId(idString);
        }
      } catch (err) {
        console.error('Error downloads profile current student:', err);
        setError(err instanceof Error ? err.message : t.profileError);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentStudentProfile();
  }, []);

  return (
    <div className='px-48 pb-8 gap-24 flex flex-col'>
      {loading && (
        <div className='bg-white rounded-2xl p-4 text-dark-gray'>
          {t.loading}
        </div>
      )}

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4'>
          {error}
        </div>
      )}

      {!loading && !error && student && (
      <>
      <div>
        <div className='flex flex-row gap-4 items-center mt-8'>
          <Image src='/NoAvatarDefault.svg' width={64} height={64} alt='Avatar' unoptimized/>
          <div className='flex flex-col'>
            <p className='text-2xl font-extrabold text-dark-gray dark:text-white'>
              {student.last_name || ''} {student.first_name || ''} {student.patronymic || ''}
            </p>
            <p className='text-lg text-dark-gray dark:text-white'>{t.headingStub}</p>
          </div>
        </div>

        {/* Fields For editing */}
        <div className='flex flex-col'>
          <div className='flex justify-end'>
            {!isEditing ? (
              <Button
                onClick={handleEditClick}
                className='bg-orange text-white hover:bg-dark-orange text-lg dark:bg-orange dark:hover:bg-dark-orange'
                icon={<span className='material-symbols-outlined'>edit</span>}
              >
                {t.edit}
              </Button>
            ) : (
              <div className='flex gap-2'>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className='bg-light-green text-white hover:bg-dark-green text-lg dark:bg-light-green dark:hover:bg-dark-green'
                  icon={<span className='material-symbols-outlined'>check</span>}
                >
                  {isSaving ? t.saving : t.save}
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className='bg-medium-blue-gray text-white hover:bg-dark-gray text-lg dark:bg-medium-blue-gray dark:hover:bg-dark-gray'
                  icon={<span className='material-symbols-outlined'>close</span>}
                >
                  {t.cancel}
                </Button>
              </div>
            )}
          </div>

          {saveError && (
            <div className='bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 mb-4'>
              {saveError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-8">
            <div className='flex flex-col gap-4'>
              {Object.entries(leftFields(t)).map(([key, label]) => (
                <div key={key}>
                  <p className="text-lg px-4 text-dark-gray dark:text-white">{label}</p>
                  <InputField
                    placeholder={label}
                    className="w-full text-lg"
                    value={isEditing && editableStudent ? (editableStudent[key as keyof Student] || '') : (student?.[key as keyof Student] || '')}
                    readOnly={!isEditing}
                    onChange={(e) => isEditing && handleFieldChange(key as keyof Student, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className='flex flex-col gap-4'>
              {Object.entries(rightFields(t)).map(([key, label]) => (
                <div key={key}>
                  <p className="text-lg px-4 text-dark-gray dark:text-white">{label}</p>
                  <InputField
                    placeholder={label}
                    className="w-full text-lg"
                    value={isEditing && editableStudent ? (editableStudent[key as keyof Student] || '') : (student?.[key as keyof Student] || '')}
                    readOnly={!isEditing}
                    onChange={(e) => isEditing && handleFieldChange(key as keyof Student, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className='flex flex-col gap-8'>
        <p className='text-2xl font-extrabold text-dark-gray dark:text-white'>{t.documents}</p>
        <div className='grid grid-cols-4 col-span-4 gap-8 justify-center items-center'>
          <Document name={t.docNames[0]} image={<Image src='/img/doc1.png' width={240} height={340} alt='Document' className='object-fill' />} />
          <Document name={t.docNames[1]} image={<Image src='/img/doc3.png' width={240} height={340} alt='Document' className='object-fill' />} />
          <Document name={t.docNames[2]} image={<Image src='/img/doc2.png' width={240} height={340} alt='Document' className='object-fill' />} />
          <Document name={t.docNames[3]} image={<Image src='/img/doc5.png' width={240} height={340} alt='Document' className='object-fill' />} />
          <Document name={t.docNames[4]} image={<Image src='/img/doc4.png' width={240} height={340} alt='Document' className='object-fill' />} />
          <Document name={t.docNames[5]} image={<Image src='/img/doc6.jpg' width={240} height={340} alt='Document' className='object-fill' />} />
          <div className='flex items-center justify-center w-[264]'>
            <Button
              className='bg-cyan text-white hover:bg-dark-cyan dark:bg-cyan dark:hover:bg-dark-cyan px-4 py-4 rounded-full'
              icon={<span className='material-symbols-outlined'>add</span>}
              aria-label={t.addDoc}
            />
          </div>
        </div>
      </div>

      {/* Trips */}
      <div className='flex flex-col gap-8'>
        <div className='flex flex-row justify-between items-center'>
          <p className='text-2xl font-extrabold text-dark-gray dark:text-white'>{t.trips}</p>
          <Button className='bg-cyan text-white hover:bg-dark-cyan dark:bg-cyan dark:hover:bg-dark-cyan text-lg' icon={<span className='material-symbols-outlined'>add</span>}>
            {t.addTrip}
          </Button>
        </div>
        <div className='flex flex-col gap-4'>
          <Trip from='Almaty' to='Krasnoyarsk' date='29.08.2026' />
          <Trip from='Moscow' to='Saint-Petersburg' date='30.08.2026' />
          <Trip from='Kazan' to='Lower Novgorod' date='31.08.2026' />
        </div>
      </div>
      </>
      )}
    </div>
  );
}