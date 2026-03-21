/**
 * Custom React hooks for data fetching and management
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiClient } from './api';
import {
  Task,
  Schedule,
  ChatMessage,
  User,
  Student,
  Teacher,
  Notification,
  TaskFilter,
  ScheduleFilter,
  PaginatedResponse,
  ApiResponse,
} from './types';

// Generic hook for fetching paginated data
export function useFetchPaginated<T>(
  fetchFn: (filters?: any) => Promise<PaginatedResponse<T>>,
  filters?: any,
  depend?: any[]
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchFn(filters);
        if (response.success) {
          setData(response.data);
          setPagination(response.pagination);
        } else {
          setError(response.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchFn, filters, ...(depend || [])]);

  return { data, loading, error, pagination };
}

// Generic hook for fetching single item
export function useFetch<T>(
  fetchFn: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchFn();
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
}

// ==================== Tasks Hooks ====================
export function useTasks(filters?: TaskFilter) {
  return useFetchPaginated(
    () => apiClient.getTasks(filters),
    filters,
    [filters?.status, filters?.groupId, filters?.page]
  );
}

export function useTaskById(id: string) {
  return useFetch(() => apiClient.getTaskById(id), [id]);
}

export function useCreateTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.createTask(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create task');
      }
      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTask, loading, error };
}

export function useUpdateTask(id: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTask = useCallback(
    async (data: Partial<Task>) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.updateTask(id, data);
        if (!response.success) {
          throw new Error(response.error || 'Failed to update task');
        }
        return response.data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  return { updateTask, loading, error };
}

export function useDeleteTask(id: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTask = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.deleteTask(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete task');
      }
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { deleteTask, loading, error };
}

// ==================== Schedule Hooks ====================
export function useSchedules(filters?: ScheduleFilter) {
  return useFetchPaginated(
    () => apiClient.getSchedules(filters),
    filters,
    [filters?.date, filters?.groupId]
  );
}

export function useScheduleByDate(date: string) {
  return useFetch(() => apiClient.getScheduleByDate(date), [date]);
}

// ==================== Chat Hooks ====================
export function useChats() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getChats();
        if (response.success) {
          setChats(response.data || []);
        } else {
          setError(response.error || 'Failed to fetch chats');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch chats');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return { chats, loading, error };
}

export function useChatMessages(chatId: string, page = 1, limit = 50) {
  return useFetchPaginated(
    () => apiClient.getChatMessages(chatId),
    { page, limit },
    [chatId, page]
  );
}

export function useSendMessage(chatId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (data: any) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.sendMessage(chatId, data);
        if (!response.success) {
          throw new Error(response.error || 'Failed to send message');
        }
        return response.data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [chatId]
  );

  return { sendMessage, loading, error };
}

// ==================== User Hooks ====================
export function useCurrentUser() {
  return useFetch(() => apiClient.getCurrentUser(), []);
}

export function useUser(id: string) {
  return useFetch(() => apiClient.getUser(id), [id]);
}

export function useUpdateUser(id: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = useCallback(
    async (data: Partial<User>) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.updateUser(id, data);
        if (!response.success) {
          throw new Error(response.error || 'Failed to update user');
        }
        return response.data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  return { updateUser, loading, error };
}

export function useStudents(filters?: any) {
  return useFetchPaginated(
    () => apiClient.getStudents(filters),
    filters,
    [filters?.groupId]
  );
}

export function useTeachers(filters?: any) {
  return useFetchPaginated(
    () => apiClient.getTeachers(filters),
    filters,
    [filters?.department]
  );
}

// ==================== Notifications Hooks ====================
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getNotifications();
        if (response.success) {
          setNotifications(response.data || []);
          setUnreadCount((response.data || []).filter(n => !n.read).length);
        } else {
          setError(response.error || 'Failed to fetch notifications');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await apiClient.markNotificationAsRead(id);
      setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  }, [notifications]);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await apiClient.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  }, [notifications]);

  return { notifications, loading, error, unreadCount, markAsRead, deleteNotification };
}

// ==================== Analytics Hooks ====================
export function useStudentArrivals(groupId?: string) {
  return useFetch(() => apiClient.getStudentArrivals(groupId), [groupId]);
}

export function useExaminationStats(groupId?: string) {
  return useFetch(() => apiClient.getExaminationStats(groupId), [groupId]);
}

export function useTaskCompletionStats(groupId?: string) {
  return useFetch(() => apiClient.getTaskCompletionStats(groupId), [groupId]);
}

// ==================== Groups Hooks ====================
export function useGroups() {
  return useFetchPaginated(() => apiClient.getGroups(), {});
}

export function useGroupById(id: string) {
  return useFetch(() => apiClient.getGroupById(id), [id]);
}

// ==================== Enrollments Hooks ====================
export function useEnrollments(filters?: any) {
  return useFetchPaginated(
    () => apiClient.getEnrollments(filters),
    filters,
    [filters?.courseId, filters?.studentId]
  );
}
