'use client';

import { useState, useRef, useEffect } from 'react';
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
}

export default function AdminProfile({ userId, onSave }: AdminProfileProps) {
  const { data: currentUser, loading: userLoading } = useCurrentUser();
  const { updateUser, loading: updateLoading, error: updateError } = useUpdateUser(userId || currentUser?.id || '');
  
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState<AdminProfileData>({
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan.petrov@unicompass.ru',
    phone: '+7 (999) 123-45-67',
    workingHours: 'Пн-Пт: 09:00 - 18:00',
  });

  const [tempData, setTempData] = useState<AdminProfileData>(profileData);

  // Load user data when it's fetched
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone || '',
      });
    }
  }, [currentUser]);

  const handleEditClick = () => {
    if (isEditing) {
      setTempData(profileData);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const updateData = {
        firstName: tempData.firstName,
        lastName: tempData.lastName,
        email: tempData.email,
        phone: tempData.phone,
      };
      await updateUser(updateData as Partial<User>);
      setProfileData(tempData);
      setIsEditing(false);
      onSave?.(tempData);
    } catch (err) {
      console.error('Failed to save profile:', err);
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
      console.log('Файл загружен:', file.name);
      // Here you can handle the file upload (e.g., send to server)
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
      {/* Краткая информация */}
      <div>
        <div className='flex flex-row gap-4 items-center mt-8'>
          <svg width="52" height="53" viewBox="0 0 52 53" fill="none" xmlns="http://www.w3.org/2000/svg" className='text-dark-gray dark:text-white'>
            <circle cx="26" cy="26" r="24.5" stroke="currentColor" stroke-width="3"/>
            <path d="M15.5713 36.5402V48.7668C15.5713 48.7668 17.7959 51.6779 25.8601 51.6779C33.9242 51.6779 36.4269 48.7668 36.4269 48.7668V36.5402C36.4269 33.0469 34.8975 26.9336 25.8601 26.9336C16.8226 26.9336 15.5713 33.1925 15.5713 36.5402Z" fill="currentColor" stroke="currentColor"/>
            <path d="M26.1396 12.2965C29.5279 12.2965 32.3133 15.1787 32.3135 18.7828C32.3135 22.3871 29.528 25.2701 26.1396 25.2701C22.7513 25.2701 19.9658 22.3871 19.9658 18.7828C19.966 15.1787 22.7514 12.2965 26.1396 12.2965Z" fill="currentColor" stroke="currentColor"/>
          </svg>
          <div className='flex flex-col'>
            <p className='text-2xl font-extrabold text-dark-gray dark:text-white'>{profileData.firstName} {profileData.lastName}</p>
            <p className='text-lg text-dark-gray dark:text-white'>Администратор</p>
          </div>
        </div>

        {/* Поля для редактирования */}
        <div className='flex flex-col'>
          <div className='flex justify-end'>
            <Button 
              className='bg-orange text-white hover:bg-dark-orange text-lg dark:bg-orange dark:hover:bg-dark-orange' 
              onClick={handleEditClick}
              disabled={updateLoading}
            >
              {isEditing ? 'Отменить' : 'Редактировать'}
            </Button>
          </div>

          {updateError && (
            <div className='text-red-600 dark:text-red-400 mb-4'>
              Ошибка: {updateError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-8">
            <div className='flex flex-col gap-4'>
              <div>
                <p className="text-lg px-4 text-dark-gray dark:text-white">Имя</p>
                <InputField 
                  placeholder='Имя' 
                  className="w-full text-lg" 
                  value={tempData.firstName}
                  onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                  name='firstName'
                  disabled={!isEditing}
                />
              </div>
              <div>
                <p className="text-lg px-4 text-dark-gray dark:text-white">Email</p>
                <InputField 
                  placeholder='Email' 
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
                <p className="text-lg px-4 text-dark-gray dark:text-white">Фамилия</p>
                <InputField 
                  placeholder='Фамилия' 
                  className="w-full text-lg" 
                  value={tempData.lastName}
                  onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                  name='lastName'
                  disabled={!isEditing}
                />
              </div>
              <div>
                <p className="text-lg px-4 text-dark-gray dark:text-white">Телефон</p>
                <InputField 
                  placeholder='Телефон' 
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
                {updateLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button 
                className='bg-gray text-white hover:bg-dark-gray px-8' 
                onClick={handleEditClick}
              >
                Отменить
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
