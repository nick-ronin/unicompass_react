/**
 * API client for backend integration
 * Uses Next.js rewrites configured in next.config.ts
 * All /api/* requests are proxied to backend
 */

import { ApiResponse, PaginatedResponse, Task, Schedule, ChatMessage, User, Student, Teacher, Notification, AnalyticsData, TaskFilter, ScheduleFilter } from './types';

class ApiClient {
  private timeout: number = 30000; // 30 seconds

  private async fetchWithTimeout<T>(url: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // ==================== Tasks ====================
  async getTasks(filters?: TaskFilter): Promise<PaginatedResponse<Task>> {
    const queryParams = new URLSearchParams();
    if (filters) {
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.assignmentType) queryParams.append('assignmentType', filters.assignmentType);
      if (filters.groupId) queryParams.append('groupId', filters.groupId);
      if (filters.countryId) queryParams.append('countryId', filters.countryId);
      if (filters.genderId) queryParams.append('genderId', filters.genderId);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
    }

    const url = `/api/task?${queryParams.toString()}`;
    return this.fetchWithTimeout<PaginatedResponse<Task>>(url);
  }

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    const url = `/api/task/${id}`;
    return this.fetchWithTimeout<ApiResponse<Task>>(url);
  }

  async createTask(data: any): Promise<ApiResponse<Task>> {
    const url = `/api/task`;
    return this.fetchWithTimeout<ApiResponse<Task>>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: Partial<Task>): Promise<ApiResponse<Task>> {
    const url = `/api/task/${id}`;
    return this.fetchWithTimeout<ApiResponse<Task>>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateStudentTask(id: string, data: { status: Task['status'] }): Promise<any> {
    const url = `/api/student_task/${id}`;
    return this.fetchWithTimeout<any>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    const url = `/api/task/${id}`;
    return this.fetchWithTimeout<ApiResponse<void>>(url, {
      method: 'DELETE',
    });
  }

  // ==================== Schedules ====================
  async getSchedules(filters?: ScheduleFilter): Promise<PaginatedResponse<Schedule>> {
    const queryParams = new URLSearchParams();
    if (filters) {
      if (filters.date) queryParams.append('date', filters.date);
      if (filters.groupId) queryParams.append('groupId', filters.groupId);
      if (filters.teacherId) queryParams.append('teacherId', filters.teacherId);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
    }

    const url = `/api/schedule?${queryParams.toString()}`;
    return this.fetchWithTimeout<PaginatedResponse<Schedule>>(url);
  }

  async getScheduleByDate(date: string): Promise<ApiResponse<Schedule>> {
    const url = `/api/schedule/by-date/${date}`;
    return this.fetchWithTimeout<ApiResponse<Schedule>>(url);
  }

  async createSchedule(data: any): Promise<ApiResponse<Schedule>> {
    const url = `/api/schedule`;
    return this.fetchWithTimeout<ApiResponse<Schedule>>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSchedule(id: string, data: Partial<Schedule>): Promise<ApiResponse<Schedule>> {
    const url = `/api/schedule/${id}`;
    return this.fetchWithTimeout<ApiResponse<Schedule>>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ==================== Chat ====================
  async getChats(): Promise<ApiResponse<any[]>> {
    const url = `/api/chat`;
    return this.fetchWithTimeout<ApiResponse<any[]>>(url);
  }

  async getChatMessages(chatId: string): Promise<PaginatedResponse<ChatMessage>> {
    const url = `/api/chat/${chatId}/messages`;
    return this.fetchWithTimeout<PaginatedResponse<ChatMessage>>(url);
  }

  async sendMessage(chatId: string, data: any): Promise<ApiResponse<ChatMessage>> {
    const url = `/api/chat/${chatId}/messages`;
    return this.fetchWithTimeout<ApiResponse<ChatMessage>>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createChat(participantIds: string[]): Promise<ApiResponse<any>> {
    const url = `/api/chat`;
    return this.fetchWithTimeout<ApiResponse<any>>(url, {
      method: 'POST',
      body: JSON.stringify({ participantIds }),
    });
  }

  // ==================== Users ====================
  async getUser(id: string): Promise<ApiResponse<User>> {
    const url = `/api/user/${id}`;
    return this.fetchWithTimeout<ApiResponse<User>>(url);
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const url = `/api/user/me`;
    return this.fetchWithTimeout<ApiResponse<User>>(url);
  }

  async updateUser(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    const url = `/api/user/${id}`;
    return this.fetchWithTimeout<ApiResponse<User>>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getStudents(filters?: any): Promise<PaginatedResponse<Student>> {
    const queryParams = new URLSearchParams();
    if (filters?.groupId) queryParams.append('groupId', filters.groupId);
    if (filters?.country) queryParams.append('country', filters.country);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    const url = `/api/student/full_info_list?${queryParams.toString()}`;
    return this.fetchWithTimeout<PaginatedResponse<Student>>(url);
  }

  async getTeachers(filters?: any): Promise<PaginatedResponse<Teacher>> {
    const queryParams = new URLSearchParams();
    if (filters?.department) queryParams.append('department', filters.department);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    const url = `/api/teacher?${queryParams.toString()}`;
    return this.fetchWithTimeout<PaginatedResponse<Teacher>>(url);
  }

  // ==================== Notifications ====================
  async getNotifications(): Promise<PaginatedResponse<Notification>> {
    const url = `/api/notification`;
    return this.fetchWithTimeout<PaginatedResponse<Notification>>(url);
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<Notification>> {
    const url = `/api/notification/${id}/read`;
    return this.fetchWithTimeout<ApiResponse<Notification>>(url, {
      method: 'PUT',
    });
  }

  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    const url = `/api/notification/${id}`;
    return this.fetchWithTimeout<ApiResponse<void>>(url, {
      method: 'DELETE',
    });
  }

  // ==================== Analytics ====================
  async getAnalytics(filter?: any): Promise<ApiResponse<AnalyticsData[]>> {
    const queryParams = new URLSearchParams();
    if (filter?.metric) queryParams.append('metric', filter.metric);
    if (filter?.groupId) queryParams.append('groupId', filter.groupId);

    const url = `/api/analytics?${queryParams.toString()}`;
    return this.fetchWithTimeout<ApiResponse<AnalyticsData[]>>(url);
  }

  async getStudentArrivals(groupId?: string): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (groupId) queryParams.append('groupId', groupId);

    const url = `/api/analytics/arrivals?${queryParams.toString()}`;
    return this.fetchWithTimeout<ApiResponse<any>>(url);
  }

  async getExaminationStats(groupId?: string): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (groupId) queryParams.append('groupId', groupId);

    const url = `/api/analytics/examinations?${queryParams.toString()}`;
    return this.fetchWithTimeout<ApiResponse<any>>(url);
  }

  async getTaskCompletionStats(groupId?: string): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (groupId) queryParams.append('groupId', groupId);

    const url = `/api/analytics/task-completion?${queryParams.toString()}`;
    return this.fetchWithTimeout<ApiResponse<any>>(url);
  }

  // ==================== Groups ====================
  async getGroups(): Promise<PaginatedResponse<any>> {
    const url = `/api/group`;
    return this.fetchWithTimeout<PaginatedResponse<any>>(url);
  }

  async getGroupById(id: string): Promise<ApiResponse<any>> {
    const url = `/api/group/${id}`;
    return this.fetchWithTimeout<ApiResponse<any>>(url);
  }

  // ==================== Enrollments ====================
  async getEnrollments(filters?: any): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    if (filters?.courseId) queryParams.append('courseId', filters.courseId);
    if (filters?.studentId) queryParams.append('studentId', filters.studentId);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    const url = `/api/enrollment?${queryParams.toString()}`;
    return this.fetchWithTimeout<PaginatedResponse<any>>(url);
  }

  // ==================== Health Check ====================
  async healthCheck(): Promise<boolean> {
    try {
      const url = `/api/health`;
      const response = await fetch(url, { method: 'GET' });
      return response.ok;
    } catch {
      return false;
    }
  }

}

// Export singleton instance
export const apiClient = new ApiClient();

// Export interface for tests
export default ApiClient;
