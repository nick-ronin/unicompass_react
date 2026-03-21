# 🏗️ Архитектура Backend Integration

## Как сейчас работает

Проект использует **Next.js Rewrites** для проксирования:

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

**Результат:** Все запросы `/api/*` → автоматически на бэк, без .env переменных!

## Диаграмма потока данных

```
┌──────────────────────────────┐
│   React Component            │
│   (AdminTaskItem, Table...)  │
└──────────────┬───────────────┘
               │ fetch('/api/task')
               │ или
               │ apiClient.getTasks()
               ▼
┌──────────────────────────────┐
│  lib/api.ts (API Client)     │
│  - 25+ методов               │
│  - Типизирован               │
│  - Error handling             │
└──────────────┬───────────────┘
               │ fetch(url)
               ▼
┌──────────────────────────────┐
│  Next.js Rewrite             │
│  /api/task → http://159...   │
└──────────────┬───────────────┘
               │ HTTP запрос
               ▼
┌──────────────────────────────┐
│  Backend API                 │
│  http://159.194.196.47:8000  │
│  ├── /api/task               │
│  ├── /api/student            │
│  ├── /api/schedule           │
│  └── ...                      │
└──────────────────────────────┘
```

## Типизация (lib/types.ts)

```typescript
Users:
  ├── BaseUser, Student, Teacher, Admin

Tasks:
  ├── Task, TaskAssignment, TaskFormData, TaskFilter

Schedules:
  ├── ScheduleItem, Schedule, ScheduleFilter

Chat:
  ├── ChatMessage, Chat

Notifications:
  ├── Notification

Analytics:
  ├── StudentArrivals, ExaminationStats, TaskCompletionStats

API:
  ├── ApiResponse<T>, PaginatedResponse<T>, ErrorResponse
```

## API методы (lib/api.ts)

```typescript
// Tasks
apiClient.getTasks()              // GET /api/task
apiClient.getTaskById(id)         // GET /api/task/:id
apiClient.createTask(data)        // POST /api/task
apiClient.updateTask(id, data)    // PUT /api/task/:id
apiClient.deleteTask(id)          // DELETE /api/task/:id

// Students
apiClient.getStudents()           // GET /api/student/full_info_list

// Teachers
apiClient.getTeachers()           // GET /api/teacher

// Schedules
apiClient.getSchedules()          // GET /api/schedule
apiClient.getScheduleByDate()     // GET /api/schedule/by-date/:date

// И ещё 20+ методов...
```

## React Hooks (lib/hooks.ts)

```typescript
// Fetching (with loading/error states)
const { data, loading, error, refetch } = useTasks()
const { data: task } = useTaskById('123')
const { data: students } = useStudents()

// Mutations (create/update/delete)
const { execute, loading } = useCreateTask()
const { execute, loading } = useUpdateTask('123')
const { execute, loading } = useDeleteTask('123')
```

## Компоненты обновлены

| Компонент | Изменения |
|-----------|-----------|
| AdminTaskItem | Использует данные с API |
| Table | Loading/error UI, пагинация |
| Schedule | Может загружать с API |
| ChatMessage | Типизирована |
| TaskCard | Обновление через API |
| AdminProfile | Синхронизация профиля |
| Button | Поддержка disabled |

## Пример использования

```typescript
'use client';

import { useTasks, useUpdateTask } from '@/lib/hooks';

export default function TaskList() {
  const { data: tasks, loading, error } = useTasks();
  const { execute: updateTask } = useUpdateTask();

  if (loading) return <Spinner />;
  if (error) return <Error error={error} />;

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.name}</h3>
          <p>{task.description}</p>
          <button 
            onClick={() => updateTask(task.id, { status: 'completed' })}
          >
            Mark Done
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Структура файлов

```
unicompass/
├── next.config.ts              # Конфигурация проксирования ⭐
│
├── lib/
│   ├── types.ts               # TypeScript типы (все сущности)
│   ├── api.ts                 # REST API клиент
│   ├── hooks.ts               # React хуки
│   └── utils.ts               # Утилиты
│
├── app/[lang]/
│   ├── admin/
│   │   ├── tasks/page.tsx     # ✅ Загружает с /api/task
│   │   └── tables/
│   │       └── students/page.tsx  # ✅ Загружает с /api/student/full_info_list
│   └── student/
│       ├── tasks/page.tsx     # TODO: обновить
│       └── ...
│
├── components/
│   ├── AdminTaskItem.tsx
│   ├── Table.tsx
│   └── ...
│
└── API_SETUP.md               # Документация API
```

## Переменные окружения

**Больше не нужно никаких переменных!**

Проксирование настроено в `next.config.ts`:

```typescript
destination: 'http://159.194.196.47:8000/:path*'
```

Если нужно изменить backend URL - отредактируйте это значение.

## Процесс разработки

1. **Компонент нужны данные**
   ```typescript
   const { data, loading, error } = useTasks();
   ```

2. **useHook вызывает API**
   ```typescript
   const data = await apiClient.getTasks();
   ```

3. **API клиент делает fetch**
   ```typescript
   fetch('/api/task')
   ```

4. **Next.js переписывает URL**
   ```
   /api/task → http://159.194.196.47:8000/api/task
   ```

5. **Backend отвечает**
   ```json
   [{ "id": "1", "name": "Task 1" }, ...]
   ```

6. **Компонент отображает данные**
   ```jsx
   {tasks.map(t => <div>{t.name}</div>)}
   ```

## Отладка

### DevTools Network Tab

```
Request:  GET /api/task
Status:   200 OK
Target:   http://159.194.196.47:8000/api/task (see Headers)
Response: [{ id, name, description, ... }]
```

### Console

```typescript
// Проверьте что fetch работает
const res = await fetch('/api/task');
console.log(res.status);
const data = await res.json();
console.log(data);
```

## Что нужно сделать

- [ ] Обновить оставшиеся页面 для загрузки с API
- [ ] Обработка ошибок (retry, offline)
- [ ] Кэширование для перформанса
- [ ] Аутентификация если нужна
- [ ] Real-time обновления (WebSocket)

## FAQ

**Q: Где переменные окружения?**  
A: В `next.config.ts`. Нет .env файла!

**Q: Как добавить новый эндпоинт?**  
A: Добавьте метод в `lib/api.ts`:
```typescript
async getNewEndpoint() {
  return this.fetchWithTimeout('/api/new-endpoint');
}
```

**Q: Как менять backend URL?**  
A: Отредактируйте `next.config.ts`:
```typescript
destination: 'http://YOUR_NEW_BACKEND:PORT/:path*'
```

---

**Для полной документации см.** → `API_SETUP.md`
