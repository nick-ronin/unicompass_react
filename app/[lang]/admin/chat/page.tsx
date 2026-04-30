'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import InputField from '@/components/Input Field';
import ChatUserCard from '@/components/ChatUserCard';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import MaterialIcon from '@/components/MaterialIcon';

interface User {
  id: string;
  nameRu?: string;
  nameEn?: string;
  fullNameRu?: string;
  fullNameEn?: string;
  lastMessage?: string;
  avatar?: string;
  lastOnline?: string;
}

interface Message {
  id: string;
  text?: string;
  image?: string;
  document?: {
    name: string;
    size: string;
  };
  caption?: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'received' | 'read';
  isOwn: boolean;
  userId: string;
}

interface ApiConversationMessage {
  id: number;
  sender_id: number;
  recipient_id: number;
  sent_at: string;
  text: string;
  sender_first_name?: string;
  recipient_first_name?: string;
}

const translations = {
  ru: {
    searchPlaceholder: 'Поиск по чатам...',
    noChats: 'Чаты не найдены',
    startConversation: 'Начните переписку!',
    selectChat: 'Выберите чат, чтобы начать общение',
    loadUsersError: 'Не удалось загрузить список пользователей',
    noUserId: 'Нужно войти, чтобы отправлять сообщения',
  },
  en: {
    searchPlaceholder: 'Search chat...',
    noChats: 'No chats found',
    startConversation: 'Start a conversation!',
    selectChat: 'Select a chat to start messaging',
    loadUsersError: 'Failed to load users',
    noUserId: 'You need to log in to send messages',
  },
};

const fallbackUsers: User[] = [
  {
    id: '1',
    nameRu: 'Иван Петров',
    nameEn: 'Ivan Petrov',
    fullNameRu: 'Иван Сергеевич Петров',
    fullNameEn: 'Ivan Sergeevich Petrov',
    lastMessage: 'How about meeting on Friday?',
    avatar: '/NoAvatarDefault.svg',
    lastOnline: 'online',
  },
  {
    id: '2',
    nameRu: 'Мария Сидорова',
    nameEn: 'Maria Sidorova',
    fullNameRu: 'Мария Ивановна Сидорова',
    fullNameEn: 'Maria Ivanovna Sidorova',
    lastMessage: 'Thanks for your help!',
    avatar: '/NoAvatarDefault.svg',
    lastOnline: '5 minutes ago',
  },
];

export default function ChatPage() {
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>(fallbackUsers);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const lang = typeof params.lang === 'string' ? params.lang : Array.isArray(params.lang) ? params.lang[0] : 'ru';
  const t = translations[lang as keyof typeof translations] || translations.ru;

  const formatTime = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleTimeString(lang === 'en' ? 'en-US' : 'ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        });
  };

  const buildAuthHeaders = (): Record<string, string> => {
    const token =
      (typeof window !== 'undefined' && localStorage.getItem('jwt')) ||
      (typeof window !== 'undefined' && localStorage.getItem('accessToken')) ||
      (typeof window !== 'undefined' && localStorage.getItem('token'));

    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const extractStoredUserId = () => {
    try {
      const storedAuth = localStorage.getItem('studentAuth') || localStorage.getItem('userAuth');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        const id = parsed?.studentId || parsed?.userId || parsed?.id;
        if (id) return String(id);
      }
      const rawId = localStorage.getItem('userId');
      return rawId || null;
    } catch (err) {
      console.warn('Cannot read stored user id', err);
      return null;
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    setUsersError(null);
    try {
      const res = await fetch('/api/student/full_info_list?limit=100', {
        headers: {
          ...buildAuthHeaders(),
        },
      });
      if (!res.ok) throw new Error('Failed to load users');
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const mapped = list.map((item: any) => ({
        id: String(item.id || item.student_id || item.user_id || crypto.randomUUID()),
        nameRu: `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim() || item.name_ru,
        nameEn: `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim() || item.name_en,
        fullNameRu: `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim() || item.full_name_ru,
        fullNameEn: `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim() || item.full_name_en,
        avatar: item.avatar || item.file_url || '/NoAvatarDefault.svg',
        lastOnline: 'online',
      })) as User[];
      if (mapped.length) {
        setUsers(mapped);
        return;
      }
      setUsers(fallbackUsers);
    } catch (err) {
      console.warn('User list fetch failed', err);
      setUsers(fallbackUsers);
      setUsersError(t.loadUsersError);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadConversation = async (partnerId: string) => {
    if (!currentUserId) return;
    setMessagesLoading(true);
    try {
      const res = await fetch(`/api/chat/conversation/${currentUserId}/${partnerId}`, {
        headers: {
          ...buildAuthHeaders(),
        },
      });
      if (!res.ok) throw new Error('Failed to load conversation');
      const data: ApiConversationMessage[] = await res.json();
      const mapped = data.map((msg) => ({
        id: String(msg.id ?? crypto.randomUUID()),
        text: msg.text,
        timestamp: formatTime(msg.sent_at),
        status: 'sent' as const,
        isOwn: String(msg.sender_id) === currentUserId,
        userId: String(msg.sender_id),
      }));

      setMessages((prev) => ({
        ...prev,
        [partnerId]: mapped,
      }));
    } catch (err) {
      console.warn('Conversation fetch failed', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    const id = extractStoredUserId();
    if (id) setCurrentUserId(String(id));
    loadUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.classList.add('hide-footer');
    return () => document.body.classList.remove('hide-footer');
  }, []);

  const localizedUsers = users.map((user) => {
    const history = messages[user.id] || [];
    const last = history.at(-1)?.text || user.lastMessage;
    return {
      ...user,
      displayName: lang === 'ru' ? user.nameRu || user.nameEn || 'Без имени' : user.nameEn || user.nameRu || 'No name',
      displayFullName: lang === 'ru' ? user.fullNameRu || user.fullNameEn || user.nameRu || user.nameEn : user.fullNameEn || user.fullNameRu || user.nameEn || user.nameRu,
      lastMessage: last,
    };
  });

  const activeUser = localizedUsers.find((u) => u.id === activeUserId);
  const filteredUsers = localizedUsers.filter((user) =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!activeUserId) return;
    const container = messagesContainerRef.current;
    if (!container) return;
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [activeUserId, messages]);

  const handleSelectUser = (userId: string) => {
    setActiveUserId(userId);
    loadConversation(userId);
  };

  const handleSendMessage = async (text: string, file?: File) => {
    if (!activeUserId || !currentUserId) return;

    const optimistic: Message = {
      id: crypto.randomUUID(),
      text: text || undefined,
      timestamp: formatTime(new Date().toISOString()),
      status: 'sending',
      isOwn: true,
      userId: currentUserId,
    };

    if (file) {
      optimistic.document = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      };
    }

    setMessages((prev) => ({
      ...prev,
      [activeUserId]: [...(prev[activeUserId] || []), optimistic],
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...buildAuthHeaders() },
        body: JSON.stringify({
          sender_id: Number(currentUserId),
          recipient_id: Number(activeUserId),
          text,
        }),
      });

      if (!res.ok) {
        const textBody = await res.text().catch(() => '');
        throw new Error(`Failed to send message: ${res.status} ${res.statusText} ${textBody}`.trim());
      }

      const saved = await res.json().catch(() => null);
      setMessages((prev) => ({
        ...prev,
        [activeUserId]: prev[activeUserId].map((msg) =>
          msg.id === optimistic.id
            ? {
                ...msg,
                id: saved?.id ? String(saved.id) : msg.id,
                timestamp: formatTime(saved?.sent_at || new Date().toISOString()),
                status: 'sent',
              }
            : msg
        ),
      }));
      loadConversation(activeUserId);
    } catch (err) {
      console.error('Send message failed', err);
      setMessages((prev) => ({
        ...prev,
        [activeUserId]: (prev[activeUserId] || []).filter((msg) => msg.id !== optimistic.id),
      }));
    }
  };

  return (
    <div className='flex min-h-[calc(100dvh-120px)] flex-col bg-white mb-8 overflow-hidden no-page-scrollbar dark:bg-surface md:h-[calc(100vh-120px)] md:flex-row'>
      {/* Left sidebar - Users list */}
      <div className='flex max-h-[38vh] w-full flex-col border-b border-light-blue-gray dark:border-dark-gray md:max-h-none md:w-80 md:border-b-0 md:border-r'>
        {/* Search */}
        <div className='border-b border-light-blue-gray p-3 dark:border-dark-gray sm:p-4'>
          <InputField
            icon={<MaterialIcon name='search' />}
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            className='w-full text-base dark:bg-dark-gray sm:text-lg'
          />
        </div>

        {/* Users list */}
        <div className='flex-1 overflow-y-auto custom-scroll md:min-h-0'>
          {loadingUsers ? (
            <div className='flex items-center justify-center h-full text-gray dark:text-white'>
              <p className='text-lg'>Loading...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className='space-y-2 p-3'>
              {filteredUsers.map((user) => (
                <ChatUserCard
                  key={user.id}
                  id={user.id}
                  name={user.displayName}
                  lastMessage={user.lastMessage || ''}
                  avatar={user.avatar}
                  isActive={activeUserId === user.id}
                  onClick={() => handleSelectUser(user.id)}
                />
              ))}
            </div>
          ) : (
            <div className='flex items-center justify-center h-full text-gray dark:text-white'>
              <p className='text-lg'>{usersError || t.noChats}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right section - Chat area */}
      <div className='flex flex-1 min-h-[52vh] flex-col bg-white dark:bg-surface md:min-h-0'>
        {activeUser ? (
          <>
            {/* Header with user info */}
            <div className='border-b border-light-blue-gray bg-white px-4 py-3 text-start dark:border-dark-gray dark:bg-surface sm:px-4'>
              <h2 className='text-xl font-semibold text-dark-gray dark:text-white sm:text-2xl'>
                {activeUser.displayFullName}
              </h2>
              <p className='mt-1 text-sm text-gray dark:text-white sm:text-base'>{activeUser.lastOnline}</p>
            </div>

            {/* Messages area */}
            <div
              ref={messagesContainerRef}
              className='flex-1 overflow-y-auto bg-white p-4 custom-scroll dark:bg-dark-gray sm:p-6'
            >
              {messagesLoading ? (
                <div className='flex items-center justify-center h-full'>
                  <p className='text-base text-gray dark:text-white sm:text-lg'>Loading...</p>
                </div>
              ) : activeUserId && (messages[activeUserId]?.length ?? 0) > 0 ? (
                <>
                  {activeUserId &&
                    messages[activeUserId]?.map((message: Message) => (
                      <ChatMessage
                        key={message.id}
                        text={message.text}
                        image={message.image}
                        document={message.document}
                        caption={message.caption}
                        timestamp={message.timestamp}
                        status={message.status}
                        isOwn={message.isOwn}
                      />
                    ))}
                </>
              ) : (
                <div className='flex items-center justify-center h-full'>
                  <p className='text-base text-gray dark:text-white sm:text-lg'>{t.startConversation}</p>
                </div>
              )}
            </div>

            {/* Message input */}
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          /* Empty state */
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center'>
              <MaterialIcon name='chat' className='mb-4 block text-5xl text-light-blue-gray dark:text-cyan sm:text-6xl' />
              <p className='text-xl text-gray dark:text-white sm:text-2xl'>{t.selectChat}</p>
              {!currentUserId && (
                <p className='text-sm text-gray dark:text-white mt-2'>{t.noUserId}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
