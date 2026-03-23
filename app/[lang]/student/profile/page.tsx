'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

interface TripModel {
  id: string;
  studentId: string;
  arrivalDate: string;
  departureDate: string;
  location: string;
}

const translations = {
  ru: {
    address: 'Адрес проживания',
    citizenship: 'Гражданство',
    passport: 'Номер паспорта',
    snils: 'СНИЛС',
    inn: 'ИНН',
    date_of_birth: 'Дата рождения',
    email: 'Электронная почта',
    sfu_email: 'Электронная почта СФУ',
    phone_home: 'Телефон родной страны',
    phone_rf: 'Телефон РФ',
    loading: 'Загрузка профиля...',
    edit: 'Редактировать',
    save: 'Сохранить',
    saving: 'Сохранение...',
    cancel: 'Отмена',
    documents: 'Мои документы',
    trips: 'Мои поездки',
    addTrip: 'Добавить поездку',
    tripLocation: 'Локация',
    arrivalDate: 'Дата прибытия',
    departureDate: 'Дата отбытия',
    tripModalTitleAdd: 'Новая поездка',
    tripModalTitleEdit: 'Редактировать поездку',
    saveTrip: 'Сохранить поездку',
    updateTrip: 'Обновить поездку',
    tripLoading: 'Загружаем поездки...',
    tripEmpty: 'Пока нет поездок.',
    tripError: 'Не удалось загрузить поездки.',
    tripSaveError: 'Не удалось сохранить поездку.',
    tripDeleteError: 'Не удалось удалить поездку.',
    tripRequired: 'Заполните все поля поездки.',
    deleting: 'Удаляем...',
    logout: 'Выйти из аккаунта',
    loggingOut: 'Выходим...',
    headingStub: 'Курс: 1, ИКИТ, КИ26-14Б',
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
    tripLocation: 'Location',
    arrivalDate: 'Arrival date',
    departureDate: 'Departure date',
    tripModalTitleAdd: 'New trip',
    tripModalTitleEdit: 'Edit trip',
    saveTrip: 'Save trip',
    updateTrip: 'Update trip',
    tripLoading: 'Loading trips...',
    tripEmpty: 'No trips yet.',
    tripError: 'Failed to load trips.',
    tripSaveError: 'Failed to save trip.',
    tripDeleteError: 'Failed to delete trip.',
    tripRequired: 'Please fill all trip fields.',
    deleting: 'Deleting...',
    logout: 'Log out',
    loggingOut: 'Signing out...',
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
  const router = useRouter();
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [trips, setTrips] = useState<TripModel[]>([]);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [tripsError, setTripsError] = useState<string | null>(null);
  const [tripModalOpen, setTripModalOpen] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [tripForm, setTripForm] = useState({ location: '', arrivalDate: '', departureDate: '' });
  const [tripSaving, setTripSaving] = useState(false);
  const [tripSaveError, setTripSaveError] = useState<string | null>(null);
  const [tripDeleteId, setTripDeleteId] = useState<string | null>(null);

  const avatarPreview = useMemo(() => {
    if (avatarFile) return URL.createObjectURL(avatarFile);
    return avatarUrl;
  }, [avatarFile, avatarUrl]);

  useEffect(() => {
    return () => {
      if (avatarFile) URL.revokeObjectURL(avatarPreview || '');
    };
  }, [avatarFile, avatarPreview]);

  const handleEditClick = () => {
    setEditableStudent(student);
    setIsEditing(true);
    setSaveError(null);
  };

  useEffect(() => {
    const storedAvatar = localStorage.getItem('studentAvatarUrl');
    if (storedAvatar) setAvatarUrl(storedAvatar);
  }, []);

  const handleCancel = () => {
    setIsEditing(false);
    setEditableStudent(null);
    setSaveError(null);
  };

  const resetTripForm = () => {
    setTripForm({ location: '', arrivalDate: '', departureDate: '' });
    setTripSaveError(null);
    setEditingTripId(null);
  };

  const closeTripModal = () => {
    setTripModalOpen(false);
    resetTripForm();
  };

  const handleOpenTripModal = () => {
    resetTripForm();
    setTripModalOpen(true);
  };

  const handleEditTrip = (trip: TripModel) => {
    setTripForm({
      location: trip.location || '',
      arrivalDate: trip.arrivalDate || '',
      departureDate: trip.departureDate || '',
    });
    setEditingTripId(trip.id);
    setTripModalOpen(true);
    setTripSaveError(null);
  };

  const fetchTripsForStudent = async (id: string) => {
    try {
      setTripsLoading(true);
      setTripsError(null);

      const response = await fetch(`/api/trip/student/${id}`);
      if (!response.ok) {
        throw new Error(`Error loading trips: ${response.status}`);
      }

      const data = await response.json();
      const list = Array.isArray(data) ? data : data.results || [];

      const normalized: TripModel[] = list.map((item: any, index: number) => ({
        id: String(item.id ?? item.trip_id ?? index),
        studentId: String(item.student_id ?? id),
        arrivalDate: item.arrival_date || '',
        departureDate: item.departure_date || '',
        location: item.location || '',
      }));

      setTrips(normalized);
    } catch (err) {
      console.error('Error loading trips:', err);
      setTripsError(t.tripError);
    } finally {
      setTripsLoading(false);
    }
  };

  const handleTripSubmit = async () => {
    if (!studentId) {
      setTripSaveError(t.notFound);
      return;
    }

    if (!tripForm.location || !tripForm.arrivalDate || !tripForm.departureDate) {
      setTripSaveError(t.tripRequired);
      return;
    }

    try {
      setTripSaving(true);
      setTripSaveError(null);

      const payload = {
        student_id: Number(studentId),
        arrival_date: tripForm.arrivalDate,
        departure_date: tripForm.departureDate,
        location: tripForm.location,
      };

      const url = editingTripId ? `/api/trip/${editingTripId}` : '/api/trip';
      const method = editingTripId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `Error while saving trip: ${response.status}`);
      }

      await fetchTripsForStudent(studentId);
      setTripModalOpen(false);
      resetTripForm();
    } catch (err) {
      console.error('Error while saving trip:', err);
      setTripSaveError(err instanceof Error ? err.message : t.tripSaveError);
    } finally {
      setTripSaving(false);
    }
  };

  const handleTripDelete = async (tripId: string) => {
    if (!studentId) return;

    try {
      setTripDeleteId(tripId);
      setTripsError(null);

      const response = await fetch(`/api/trip/${tripId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `Error while deleting trip: ${response.status}`);
      }

      await fetchTripsForStudent(studentId);
    } catch (err) {
      console.error('Error deleting trip:', err);
      setTripsError(err instanceof Error ? err.message : t.tripDeleteError);
    } finally {
      setTripDeleteId(null);
    }
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

      if (avatarFile) {
        setAvatarUploading(true);
        const formData = new FormData();
        formData.append('file', avatarFile);

        const uploadResponse = await fetch(`/api/files/upload-avatar/${studentId}`, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          throw new Error(
            errorData.detail ||
            errorData.message ||
            `Error while uploading avatar: ${uploadResponse.status}`
          );
        }

        const uploadData = await uploadResponse.json().catch(() => ({}));
        const uploadedUrl = uploadData.file_url || uploadData.url || null;
        if (uploadedUrl) {
          setAvatarUrl(uploadedUrl);
          localStorage.setItem('studentAvatarUrl', uploadedUrl);
        }
      }

      setStudent(editableStudent);
      setIsEditing(false);
      setEditableStudent(null);
      setAvatarFile(null);
    } catch (err) {
      console.error('Error while saving profile:', err);
      setSaveError(
        err instanceof Error ? err.message : t.saveError
      );
    } finally {
      setAvatarUploading(false);
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const storedToken =
        localStorage.getItem('jwt') ||
        localStorage.getItem('accessToken') ||
        localStorage.getItem('token');

      try {
        await fetch('/api/logout', {
          method: 'POST',
          headers: storedToken
            ? { Authorization: `Bearer ${storedToken}` }
            : undefined,
        });
      } catch (logoutErr) {
        console.warn('Logout request failed, continuing cleanup', logoutErr);
      }

      localStorage.removeItem('studentAuth');
      localStorage.removeItem('studentAvatarUrl');
      localStorage.removeItem('jwt');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setIsLoggingOut(false);
      router.replace(`/${langParam}/login`);
    }
  };

  useEffect(() => {
    const loadCurrentStudentProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedAuthRaw = localStorage.getItem('studentAuth');
        if (!storedAuthRaw) {
          setLoading(false);
          router.replace(`/${langParam}/login`);
          return;
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

          try {
            const avatarResponse = await fetch(`/api/files/upload-avatar/${idString}`);
            if (avatarResponse.ok) {
              const avatarData = await avatarResponse.json().catch(() => ({}));
              const url = avatarData.file_url || avatarData.url || null;
              if (url) {
                setAvatarUrl(url);
                localStorage.setItem('studentAvatarUrl', url);
              }
            }
          } catch (avatarErr) {
            console.warn('Avatar load skipped:', avatarErr);
          }
        }
      } catch (err) {
        console.error('Error downloads profile current student:', err);
        setError(err instanceof Error ? err.message : t.profileError);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentStudentProfile();
  }, [langParam, router]);

  useEffect(() => {
    if (!studentId) return;
    fetchTripsForStudent(studentId);
  }, [studentId]);

  return (
    <>
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
          <div className='relative w-16 h-16'>
            <Image
              src={avatarPreview || '/NoAvatarDefault.svg'}
              width={64}
              height={64}
              alt='Avatar'
              unoptimized
              className='rounded-full object-cover'
            />
            {isEditing && (
              <label className='absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white text-xs cursor-pointer'>
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setAvatarFile(file);
                  }}
                />
                {avatarUploading ? t.saving : 'Edit'}
              </label>
            )}
          </div>
          <div className='flex flex-col'>
            <p className='text-2xl font-extrabold text-dark-gray dark:text-white'>
              {student.last_name || ''} {student.first_name || ''} {student.patronymic || ''}
            </p>
            <p className='text-lg text-dark-gray dark:text-white'>{t.headingStub}</p>
          </div>
        </div>

        {/* Fields For editing */}
        <div className='flex flex-col'>
          <div className='flex justify-end gap-3'>
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
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className='bg-red-500 text-white hover:bg-red-600 text-lg'
              icon={<span className='material-symbols-outlined'>logout</span>}
            >
              {isLoggingOut ? t.loggingOut : t.logout}
            </Button>
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
          <Button
            onClick={handleOpenTripModal}
            disabled={!studentId || tripsLoading}
            className='bg-cyan text-white hover:bg-dark-cyan dark:bg-cyan dark:hover:bg-dark-cyan text-lg disabled:opacity-60 disabled:cursor-not-allowed'
            icon={<span className='material-symbols-outlined'>add</span>}
          >
            {t.addTrip}
          </Button>
        </div>
        {tripsError && (
          <div className='bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4'>
            {tripsError}
          </div>
        )}

        {tripsLoading && (
          <div className='bg-white rounded-2xl p-4 text-dark-gray dark:text-white'>
            {t.tripLoading}
          </div>
        )}

        {!tripsLoading && trips.length === 0 && !tripsError && (
          <div className='bg-light-blue-gray dark:bg-surface rounded-2xl p-4 text-dark-gray dark:text-white'>
            {t.tripEmpty}
          </div>
        )}

        <div className='flex flex-col gap-4'>
          {trips.map((trip) => (
            <Trip
              key={trip.id}
              location={trip.location}
              arrivalDate={trip.arrivalDate}
              departureDate={trip.departureDate}
              onEdit={() => handleEditTrip(trip)}
              onDelete={() => {
                if (tripDeleteId) return;
                handleTripDelete(trip.id);
              }}
            />
          ))}
        </div>

        {tripDeleteId && (
          <div className='text-sm text-gray-700 dark:text-gray-300'>{t.deleting}</div>
        )}
      </div>
      </>
      )}
    </div>

    {tripModalOpen && (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
        <div className='bg-white dark:bg-surface rounded-2xl p-6 w-full max-w-lg shadow-xl flex flex-col gap-4'>
          <div className='flex justify-between items-center'>
            <p className='text-xl font-extrabold text-dark-gray dark:text-white'>
              {editingTripId ? t.tripModalTitleEdit : t.tripModalTitleAdd}
            </p>
            <button
              type='button'
              onClick={closeTripModal}
              className='text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
              aria-label='Close'
            >
              <span className='material-symbols-outlined'>close</span>
            </button>
          </div>

          <div className='flex flex-col gap-3'>
            <div>
              <p className='text-lg px-1 text-dark-gray dark:text-white'>{t.tripLocation}</p>
              <InputField
                placeholder={t.tripLocation}
                value={tripForm.location}
                onChange={(e) => setTripForm((prev) => ({ ...prev, location: e.target.value }))}
                className='w-full'
              />
            </div>
            <div>
              <p className='text-lg px-1 text-dark-gray dark:text-white'>{t.arrivalDate}</p>
              <InputField
                type='date'
                placeholder={t.arrivalDate}
                value={tripForm.arrivalDate}
                onChange={(e) => setTripForm((prev) => ({ ...prev, arrivalDate: e.target.value }))}
                className='w-full'
              />
            </div>
            <div>
              <p className='text-lg px-1 text-dark-gray dark:text-white'>{t.departureDate}</p>
              <InputField
                type='date'
                placeholder={t.departureDate}
                value={tripForm.departureDate}
                onChange={(e) => setTripForm((prev) => ({ ...prev, departureDate: e.target.value }))}
                className='w-full'
              />
            </div>
          </div>

          {tripSaveError && (
            <div className='bg-red-50 border border-red-200 text-red-800 rounded-2xl p-3'>
              {tripSaveError}
            </div>
          )}

          <div className='flex justify-end gap-2'>
            <Button
              onClick={closeTripModal}
              disabled={tripSaving}
              className='bg-medium-blue-gray text-white hover:bg-dark-gray text-lg dark:bg-medium-blue-gray dark:hover:bg-dark-gray'
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handleTripSubmit}
              disabled={tripSaving}
              className='bg-cyan text-white hover:bg-dark-cyan dark:bg-cyan dark:hover:bg-dark-cyan text-lg'
            >
              {tripSaving ? t.saving : editingTripId ? t.updateTrip : t.saveTrip}
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}