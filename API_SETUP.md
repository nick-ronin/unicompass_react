# API Setup & Integration

## Текущая архитектура

Проект использует **Next.js Rewrites** для проксирования API запросов:

```typescript
// next.config.ts
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://159.194.196.47:8000/:path*'
    }
  ]
}
```

**Что это значит:**
- Все запросы на `/api/*` автоматически переписываются на `http://159.194.196.47:8000/*`
- Ни каких переменных окружения не нужно
- Ни каких .env файлов не требуется

## Как использовать

### 1. Простой fetch (где угодно)

```typescript
// В компоненте или API route
const response = await fetch('/api/task');
const tasks = await response.json();
```

### 2. Через API클라이ент (lib/api.ts)

```typescript
import { apiClient } from '@/lib/api';

// Получить все задачи
const tasks = await apiClient.getTasks();

// Получить одну задачу
const task = await apiClient.getTaskById('123');

// Создать задачу
const newTask = await apiClient.createTask({ name: 'New Task' });

// Обновить задачу
const updated = await apiClient.updateTask('123', { name: 'Updated' });

// Удалить задачу
await apiClient.deleteTask('123');
```

### 3. Через React Hooks (lib/hooks.ts)

```typescript
'use client';

import { useTasks, useUpdateTask } from '@/lib/hooks';

export default function TaskList() {
  // Получить список с loading/error состояниями
  const { data: tasks, loading, error } = useTasks();
  
  // Обновить задачу
  const { execute: updateTask } = useUpdateTask('task-id');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {tasks.map(task => (
        <div key={task.id} onClick={() => updateTask({ status: 'completed' })}>
          {task.name}
        </div>
      ))}
    </div>
  );
}
```

## Типизация

Все типы определены в `lib/types.ts`:

```typescript
import { 
  Task, 
  Schedule, 
  Chat, 
  User, 
  Student, 
  Notification,
  AnalyticsData,
  ApiResponse,
  PaginatedResponse
} from '@/lib/types';

// Используйте везде
const task: Task = { ... };
const user: User = { ... };
```

## API методы

### Tasks (`/api/task`)
```typescript
apiClient.getTasks(filters?)              // GET all
apiClient.getTaskById(id)                 // GET one
apiClient.createTask(data)                // POST
apiClient.updateTask(id, data)            // PUT
apiClient.deleteTask(id)                  // DELETE
```

### Students (`/api/student`)
```typescript
apiClient.getStudents(filters?)           // GET /api/student/full_info_list
```

### Teachers (`/api/teacher`)
```typescript
apiClient.getTeachers(filters?)           // GET /api/teacher
```

### Schedules (`/api/schedule`)
```typescript
apiClient.getSchedules(filters?)          // GET /api/schedule
apiClient.getScheduleByDate(date)         // GET /api/schedule/by-date/:date
apiClient.createSchedule(data)            // POST /api/schedule
apiClient.updateSchedule(id, data)        // PUT /api/schedule/:id
```

### Chat (`/api/chat`)
```typescript
apiClient.getChats()                      // GET /api/chat
apiClient.getChatMessages(chatId)         // GET /api/chat/:id/messages
apiClient.sendMessage(chatId, data)       // POST /api/chat/:id/messages
```

### Users (`/api/user`)
```typescript
apiClient.getUser(id)                     // GET /api/user/:id
apiClient.getCurrentUser()                // GET /api/user/me
apiClient.updateUser(id, data)            // PUT /api/user/:id
```

### Notifications (`/api/notification`)
```typescript
apiClient.getNotifications()              // GET /api/notification
apiClient.markNotificationAsRead(id)      // PUT /api/notification/:id/read
apiClient.deleteNotification(id)          // DELETE /api/notification/:id
```

### Groups (`/api/group`)
```typescript
apiClient.getGroups()                     // GET /api/group
apiClient.getGroupById(id)                // GET /api/group/:id
```

### Enrollments (`/api/enrollment`)
```typescript
apiClient.getEnrollments(filters?)        // GET /api/enrollment
```

### Analytics (`/api/analytics`)
```typescript
apiClient.getAnalytics(filter?)           // GET /api/analytics
apiClient.getStudentArrivals(groupId?)    // GET /api/analytics/arrivals
apiClient.getExaminationStats(groupId?)   // GET /api/analytics/examinations
apiClient.getTaskCompletionStats(groupId?)// GET /api/analytics/task-completion
```

## Примеры

### Пример 1: Загрузить задачи админа

**Файл:** `app/[lang]/admin/tasks/page.tsx` (уже обновлено ✅)

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await fetch('/api/task');
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  return (
    <div>
      {loading && <p>Загрузка...</p>}
      {error && <p>Ошибка: {error}</p>}
      {tasks.map(task => <div key={task.id}>{task.name}</div>)}
    </div>
  );
}
```

### Пример 2: Загрузить студентов

**Файл:** `app/[lang]/admin/tables/students/page.tsx` (уже обновлено ✅)

```typescript
useEffect(() => {
  const fetchStudents = async () => {
    const response = await fetch('/api/student/full_info_list');
    const data = await response.json();
    setStudents(data);
  };
  fetchStudents();
}, []);
```

### Пример 3: Использовать хуки

```typescript
'use client';

import { useTasks, useUpdateTask } from '@/lib/hooks';

export default function TaskComponent() {
  const { data: tasks, loading } = useTasks();
  const { execute: updateTask } = useUpdateTask('123');

  if (loading) return <div>Loading...</div>;

  return (
    <button onClick={() => updateTask({ status: 'completed' })}>
      Mark as Done
    </button>
  );
}
```

## Отладка

### 1. Проверить Network tab в DevTools

DevTools → Network → Каждый запрос покажет:
- **URL:** `/api/task` (проксируется на backend)
- **Status:** 200 OK или ошибка
- **Response:** JSON данные
- **Headers:** Запрос/ответ

### 2. Посмотреть ошибку в консоли

```typescript
const response = await fetch('/api/task');
console.log('Status:', response.status);
console.log('Response:', await response.json());
```

### 3. Проверить backend доступен

```bash
curl http://159.194.196.47:8000/api/task
```

## Структура проекта

```
lib/
├── types.ts      # Типы для всех сущностей
├── api.ts        # REST API клиент (apiClient singleton)
└── hooks.ts      # React хуки для удобства

app/[lang]/admin/
├── tasks/        # ✅ Загружает с /api/task
└── tables/
    └── students/ # ✅ Загружает с /api/student/full_info_list

components/
├── AdminTaskItem.tsx      # Компонент задачи
├── Table.tsx             # Универсальная таблица
└── ... (другие компоненты)
```

## Что дальше

1. **Обновить остальные страницы** — использовать `/api/*` для загрузки данных
2. **Обработка ошибок** — добавить retry, offline поддержку
3. **Кэширование** — улучшить производительность
4. **Аутентификация** — добавить токены если нужно
5. **Real-time** — WebSocket для live обновлений (опционально)

## FAQ

**Q: Где хранятся переменные окружения?**  
A: Их больше нет! Проксирование настроено в `next.config.ts`

**Q: Как изменить backend URL?**  
A: Обновите `destination` в `next.config.ts`:
```typescript
destination: 'http://YOUR_NEW_BACKEND:8000/:path*'
```

**Q: Как добавить новый эндпоинт?**  
A: Добавьте метод в `lib/api.ts` и хук в `lib/hooks.ts`

**Q: Почему fetch в компоненте, а не всегда через хуки?**  
A: Оба способа работают. Хуки удобнее и с меньше бойлерплейта.
