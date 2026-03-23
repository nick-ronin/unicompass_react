'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';
import InputField from './Input Field';
import Image from 'next/image';
import { useCurrentUser, useUpdateUser } from '@/lib/hooks';
import { User } from '@/lib/types';

interface AdminProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  workingHours?: string;
}

interface AdminProfileProps {
  userId?: string;
  onSave?: (data: AdminProfileData) => void;
  lang?: 'ru' | 'en';
}

const translations = {
  ru: {
    admin: 'Администратор',
    edit: 'Редактировать',
    cancel: 'Отмена',
    save: 'Сохранить',
    saving: 'Сохранение...',
    firstName: 'Имя',
    lastName: 'Фамилия',
    email: 'Email',
    phone: 'Телефон',
    logout: 'Выйти из аккаунта',
    loggingOut: 'Выходим...',
    error: 'Ошибка:',
  },
  en: {
    admin: 'Administrator',
    edit: 'Edit',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone',
    logout: 'Log out',
    loggingOut: 'Signing out...',
    error: 'Error:',
  },
};

export default function AdminProfile({ userId, onSave, lang = 'ru' }: AdminProfileProps) {
  const t = translations[lang] || translations.ru;
  const router = useRouter();
  const { data: currentUser, loading: userLoading } = useCurrentUser();
  const { updateUser, loading: updateLoading, error: updateError } = useUpdateUser(userId || currentUser?.id || '');
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  
  const [profileData, setProfileData] = useState<AdminProfileData>({
    firstName: 'Ivan',
    lastName: 'Petrov',
    email: 'ivan.petrov@unicompass.ru',
    phone: '+7 (999) 123-45-67',
    workingHours: 'Mon-Fri: 09:00 - 18:00',
  });

  const [tempData, setTempData] = useState<AdminProfileData>(profileData);

  const avatarPreview = useMemo(() => {
    if (avatarFile) return URL.createObjectURL(avatarFile);
    return avatarUrl;
  }, [avatarFile, avatarUrl]);

  useEffect(() => {
    const storedAvatar = localStorage.getItem('adminAvatarUrl');
    if (storedAvatar) setAvatarUrl(storedAvatar);
  }, []);

  // Load user data when it's fetched
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone || '',
      });
      if (currentUser.avatar) {
        setAvatarUrl(currentUser.avatar);
        localStorage.setItem('adminAvatarUrl', currentUser.avatar);
      }
    }
  }, [currentUser]);

  useEffect(() => () => {
    if (avatarFile) URL.revokeObjectURL(avatarPreview || '');
  }, [avatarFile, avatarPreview]);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!currentUser?.id) return;
      try {
        const response = await fetch(`/api/files/upload-avatar/${currentUser.id}`);
        if (!response.ok) return;

        const data = await response.json().catch(() => ({}));
        const url = data.file_url || data.url || null;
        if (url) {
          setAvatarUrl(url);
          localStorage.setItem('adminAvatarUrl', url);
        }
      } catch (err) {
        console.warn('Admin avatar load skipped:', err);
      }
    };

    fetchAvatar();
  }, [currentUser?.id]);

  const handleEditClick = () => {
    setTempData(profileData);
    if (isEditing) {
      setAvatarFile(null);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const targetUserId = userId || currentUser?.id;
      if (!targetUserId) return;

      const updateData = {
        firstName: tempData.firstName,
        lastName: tempData.lastName,
        email: tempData.email,
        phone: tempData.phone,
      };
      await updateUser(updateData as Partial<User>);

      if (avatarFile) {
        setAvatarUploading(true);
        const formData = new FormData();
        formData.append('file', avatarFile);

        const uploadResponse = await fetch(`/api/files/upload-avatar/${targetUserId}`, {
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
          localStorage.setItem('adminAvatarUrl', uploadedUrl);
        }
      }

      setProfileData(tempData);
      setIsEditing(false);
      onSave?.(tempData);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setAvatarUploading(false);
      setAvatarFile(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
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
        console.warn('Admin logout request failed, continuing cleanup', logoutErr);
      }

      localStorage.removeItem('studentAuth');
      localStorage.removeItem('studentAvatarUrl');
      localStorage.removeItem('adminAvatarUrl');
      localStorage.removeItem('jwt');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setIsLoggingOut(false);
      router.replace(`/${lang}/login`);
    }
  };

  if (userLoading) {
    return (
      <div className='px-48 pb-8 gap-24 flex flex-col'>
        <div className='animate-pulse'>
          <div className='h-20 bg-gray-300 dark:bg-gray-700 rounded mb-4'></div>
          <div className='space-y-4'>
            {[1, 2, 3].map(i => (
              <div key={i} className='h-10 bg-gray-300 dark:bg-gray-700 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='px-48 pb-8 gap-24 flex flex-col'>
      {/* Summary information */}
      <div>
        <div className='flex flex-row gap-4 items-center mt-8'>
          <div className='relative w-16 h-16'>
            <Image
              src={avatarPreview || '/NoAvatarDefault.svg'}
              alt='Avatar'
              width={64}
              height={64}
              unoptimized
              className='rounded-full object-cover'
            />
            {isEditing && (
              <label className='absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white text-xs cursor-pointer'>
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleAvatarUpload}
                />
                {avatarUploading ? t.saving : t.edit}
              </label>
            )}
          </div>
          <div className='flex flex-col'>
            <p className='text-2xl font-extrabold text-dark-gray dark:text-white'>{profileData.firstName} {profileData.lastName}</p>
            <p className='text-lg text-dark-gray dark:text-white'>{t.admin}</p>
          </div>
        </div>

        {/* Editing fields */}
        <div className='flex flex-col'>
          <div className='flex justify-end gap-3'>
            <Button 
              className='bg-orange text-white hover:bg-dark-orange text-lg dark:bg-orange dark:hover:bg-dark-orange' 
              onClick={handleEditClick}
              disabled={updateLoading}
            >
              {isEditing ? t.cancel : t.edit}
            </Button>
            <Button
              className='bg-red-500 text-white hover:bg-red-600 text-lg'
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? t.loggingOut : t.logout}
            </Button>
          </div>

          {updateError && (
            <div className='text-red-600 dark:text-red-400 mb-4'>
              {t.error} {updateError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-8">
            <div className='flex flex-col gap-4'>
              <div>
                <p className="text-lg px-4 text-dark-gray dark:text-white">{t.firstName}</p>
                <InputField 
                  placeholder={t.firstName}
                  className="w-full text-lg" 
                  value={tempData.firstName}
                  onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                  name='firstName'
                  disabled={!isEditing}
                />
              </div>
              <div>
                <p className="text-lg px-4 text-dark-gray dark:text-white">{t.email}</p>
                <InputField 
                  placeholder={t.email}
                  className="w-full text-lg" 
                  value={tempData.email}
                  onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                  name='email'
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className='flex flex-col gap-4'>
              <div>
                <p className="text-lg px-4 text-dark-gray dark:text-white">{t.lastName}</p>
                <InputField 
                  placeholder={t.lastName}
                  className="w-full text-lg" 
                  value={tempData.lastName}
                  onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                  name='lastName'
                  disabled={!isEditing}
                />
              </div>
              <div>
                <p className="text-lg px-4 text-dark-gray dark:text-white">{t.phone}</p>
                <InputField 
                  placeholder={t.phone}
                  className="w-full text-lg" 
                  value={tempData.phone}
                  onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                  name='phone'
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className='flex gap-4 mt-4'>
              <Button 
                className='bg-green text-white hover:bg-dark-green px-8 dark:bg-green dark:hover:bg-dark-green' 
                onClick={handleSave}
                disabled={updateLoading}
              >
                {updateLoading ? t.saving : t.save}
              </Button>
              <Button 
                className='bg-gray text-white hover:bg-dark-gray px-8' 
                onClick={handleEditClick}
              >
                {t.cancel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
