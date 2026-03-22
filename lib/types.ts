/**
 * Core data types for backend integration
 */

// User types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Student extends User {
  role: 'student';
  groupId: string;
  country?: string;
  gender?: 'male' | 'female';
  enrollmentDate?: string;
  status: 'active' | 'inactive' | 'graduated';
}

export interface Teacher extends User {
  role: 'teacher';
  department?: string;
  specialization?: string;
  phone: string;
}

export interface Admin extends User {
  role: 'admin';
  workingHours?: string;
  department?: string;
}

// Task types
export interface Task {
  id: string;
  name: string;
  description: string;
  deadline: string;
  status: 'completed' | 'in-progress' | 'not completed';
  createdBy: string;
  assignedTo: string[];
  assignmentType: 'all' | 'group' | 'country' | 'gender';
  completionPercent?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  userId: string;
  status: 'completed' | 'in-progress' | 'not completed';
  completedAt?: string;
  notes?: string;
}

// Schedule types
export interface ScheduleItem {
  id: string;
  time: string;
  subject: string;
  type: 'lecture' | 'practical class' | 'lab work' | 'LMS';
  location: string;
  teacherId: string;
  groupId: string;
  date: string;
  isCurrent?: boolean;
}

export interface Schedule {
  id: string;
  date: string;
  items: ScheduleItem[];
}

// Chat types
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  chatId: string;
  text?: string;
  image?: string;
  document?: {
    name: string;
    url: string;
    size: string;
    mimeType?: string;
  };
  caption?: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'received' | 'read';
  isOwn?: boolean;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// Group types
export interface Group {
  id: string;
  name: string;
  country?: string;
  students: Student[];
  teachers: Teacher[];
  createdAt: string;
  updatedAt: string;
}

// Enrollment types
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'dropped';
  grade?: string;
  progress?: number;
}

// Course types
export interface Course {
  id: string;
  name: string;
  description?: string;
  teacherId: string;
  students: Student[];
  enrollments: Enrollment[];
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'task' | 'message' | 'announcement' | 'deadline';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

// Trip types
export interface Trip {
  id: string;
  from: string;
  to: string;
  date: string;
  studentId?: string;
  groupId?: string;
}

// Analytics types
export interface AnalyticsData {
  id: string;
  metric: string;
  value: number;
  date: string;
  groupId?: string;
}

export interface StudentArrivals {
  date: string;
  count: number;
  total: number;
  percentage: number;
}

export interface ExaminationStats {
  course: string;
  passed: number;
  failed: number;
  average: number;
}

export interface TaskCompletionStats {
  taskName: string;
  completed: number;
  inProgress: number;
  notCompleted: number;
  totalStudents: number;
  completionPercent: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
}

// Filter types
export interface TaskFilter {
  status?: 'completed' | 'in-progress' | 'not completed';
  assignmentType?: 'all' | 'group' | 'country' | 'gender';
  groupId?: string;
  countryId?: string;
  genderId?: string;
  page?: number;
  limit?: number;
}

export interface ScheduleFilter {
  date?: string;
  groupId?: string;
  teacherId?: string;
  page?: number;
  limit?: number;
}

// Form data types
export interface TaskFormData {
  name: string;
  description: string;
  deadline: string;
  assignmentType: 'all' | 'group' | 'country' | 'gender';
  selectedGroups?: string[];
  selectedCountries?: string[];
  selectedGenders?: string[];
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}
