'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface NotificationItem {
  id: number;
  user_id: number;
  type: string;
  payload: string;
  link?: string;
  created_at: string;
  read: boolean;
}

interface NotificationsBellProps {
  lang?: string;
  role?: string;
}

export default function NotificationsBell({ lang = 'ru', role = 'student' }: NotificationsBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [markingId, setMarkingId] = useState<number | null>(null);

  useEffect(() => {
    const storedAuthRaw = typeof window !== 'undefined' ? localStorage.getItem('studentAuth') : null;
    if (!storedAuthRaw) return;
    try {
      const parsed = JSON.parse(storedAuthRaw) as { studentId?: string | number | null; userId?: string | number | null };
      const foundId = parsed?.studentId ?? parsed?.userId;
      if (foundId !== undefined && foundId !== null) {
        setUserId(String(foundId));
      }
    } catch (err) {
      console.warn('NotificationsBell: failed to parse stored auth', err);
    }
  }, [role]);

  const fetchNotifications = async () => {
    if (!userId) {
      setError('Не удалось определить пользователя');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/notifications/user/${userId}`);
      if (!res.ok) {
        throw new Error(`Ошибка загрузки уведомлений (${res.status})`);
      }
      const data = await res.json().catch(() => []);
      const safeList = Array.isArray(data) ? data : [];
      setNotifications(safeList);
      setHasFetched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки уведомлений');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!hasFetched && !loading) {
      fetchNotifications();
    }
  };

  const handleClose = () => setIsOpen(false);

  const markAsRead = async (id: number) => {
    if (!userId) {
      setError('Не удалось определить пользователя');
      return;
    }
    setMarkingId(id);
    try {
      const res = await fetch(`/api/notifications/user/${userId}/notifications/${id}/read`, { method: 'POST' });
      if (!res.ok) {
        throw new Error('Не удалось отметить как прочитанное');
      }
      setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении уведомления');
    } finally {
      setMarkingId(null);
    }
  };

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString(lang === 'en' ? 'en-US' : 'ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='relative'>
      <button
        type='button'
        onClick={handleOpen}
        className='relative flex items-center justify-center rounded-full p-2 hover:text-dark-orange transition-colors cursor-pointer'
        aria-label='Открыть уведомления'
      >
        <span className='material-symbols-outlined'>notifications</span>
        {unreadCount > 0 && (
          <span className='absolute -top-1 -right-1 bg-orange text-white text-xs w-5 h-5 rounded-full flex items-center justify-center'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-start justify-end bg-black/40 backdrop-blur-sm' onClick={handleClose}>
          <div
            className='mt-16 mr-6 w-full max-w-md bg-white dark:bg-surface text-dark-gray dark:text-white rounded-2xl shadow-xl border border-light-blue-gray/60 dark:border-dark-gray'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between px-5 py-4 border-b border-light-blue-gray/60 dark:border-dark-gray'>
              <div className='flex items-center gap-2'>
                <span className='material-symbols-outlined'>notifications</span>
                <div className='font-semibold text-lg'>Уведомления</div>
              </div>
              <button onClick={handleClose} aria-label='Закрыть уведомления' className='hover:text-dark-orange'>
                <span className='material-symbols-outlined'>close</span>
              </button>
            </div>

            <div className='max-h-[70vh] overflow-y-auto px-5 py-4 space-y-3'>
              {loading && <div className='text-medium-blue-gray'>Загружаем уведомления…</div>}
              {error && !loading && <div className='text-red-500 text-sm'>{error}</div>}
              {!loading && !error && notifications.length === 0 && (
                <div className='text-medium-blue-gray'>Нет уведомлений</div>
              )}

              {!loading && !error && notifications.map((item) => (
                <div
                  key={item.id}
                  className='border border-light-blue-gray/60 dark:border-dark-gray rounded-xl p-4 flex flex-col gap-2 bg-light-gray/20 dark:bg-dark-gray/30'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div className='flex-1'>
                      <div className='text-sm uppercase tracking-wide text-medium-blue-gray'>{item.type || 'Уведомление'}</div>
                      <div className='text-base'>{item.payload}</div>
                      {item.link && (
                        <Link href={item.link} className='text-orange hover:text-dark-orange text-sm font-semibold' onClick={handleClose}>
                          Открыть
                        </Link>
                      )}
                    </div>
                    <div className='text-xs text-medium-blue-gray whitespace-nowrap'>{formatDate(item.created_at)}</div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className={`text-xs px-2 py-1 rounded-full ${item.read ? 'bg-light-gray text-dark-gray' : 'bg-orange/10 text-dark-orange'}`}>
                      {item.read ? 'Прочитано' : 'Новое'}
                    </span>
                    {!item.read && (
                      <button
                        type='button'
                        onClick={() => markAsRead(item.id)}
                        disabled={markingId === item.id}
                        className='text-sm text-orange hover:text-dark-orange disabled:opacity-60'
                      >
                        {markingId === item.id ? 'Сохраняем…' : 'Отметить как прочитано'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
