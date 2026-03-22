'use client';

import { useState, useRef, useEffect } from 'react';
import InputField from '@/components/Input Field';
import ChatUserCard from '@/components/ChatUserCard';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';

interface User {
  id: string;
  name: string;
  fullName: string;
  lastMessage: string;
  avatar?: string;
  lastOnline: string;
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

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Иван Петров',
    fullName: 'Иван Сергеевич Петров',
    lastMessage: 'Как насчет встречи в пятницу?',
    avatar: '/NoAvatarDefault.svg',
    lastOnline: 'в сети',
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    fullName: 'Мария Ивановна Сидорова',
    lastMessage: 'Спасибо за помощь!',
    avatar: '/NoAvatarDefault.svg',
    lastOnline: '5 минут назад',
  },
  {
    id: '3',
    name: 'Сергей Иванов',
    fullName: 'Сергей Петрович Иванов',
    lastMessage: 'Отправил тебе файл',
    avatar: '/NoAvatarDefault.svg',
    lastOnline: '1 час назад',
  },
  {
    id: '4',
    name: 'Алексей Козлов',
    fullName: 'Алексей Викторович Козлов',
    lastMessage: 'До встречи!',
    avatar: '/NoAvatarDefault.svg',
    lastOnline: 'вчера',
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      text: 'Привет! Как дела?',
      timestamp: '10:30',
      status: 'read',
      isOwn: false,
      userId: '1',
    },
    {
      id: '2',
      text: 'Привет! Спасибо, хорошо! А у тебя?',
      timestamp: '10:31',
      status: 'read',
      isOwn: true,
      userId: '1',
    },
    {
      id: '3',
      text: 'Тоже хорошо! Как насчет встречи в пятницу?',
      timestamp: '10:32',
      status: 'received',
      isOwn: false,
      userId: '1',
    },
  ],
  '2': [
    {
      id: '1',
      text: 'Привет, можешь помочь с заданием?',
      timestamp: '09:15',
      status: 'read',
      isOwn: false,
      userId: '2',
    },
    {
      id: '2',
      text: 'Конечно, помогу!',
      timestamp: '09:16',
      status: 'read',
      isOwn: true,
      userId: '2',
    },
    {
      id: '3',
      text: 'Спасибо за помощь!',
      timestamp: '09:20',
      status: 'received',
      isOwn: false,
      userId: '2',
    },
  ],
  '3': [
    {
      id: '1',
      text: 'Посмотри файл, который я отправил',
      timestamp: '11:00',
      status: 'read',
      isOwn: false,
      userId: '3',
    },
    {
      id: '2',
      document: {
        name: 'presentation.pdf',
        size: '2.5 MB',
      },
      caption: 'Вот презентация',
      timestamp: '11:01',
      status: 'sent',
      isOwn: true,
      userId: '3',
    },
  ],
  '4': [
    {
      id: '1',
      text: 'Увидимся в пятницу!',
      timestamp: '14:45',
      status: 'read',
      isOwn: false,
      userId: '4',
    },
    {
      id: '2',
      text: 'Да, до встречи!',
      timestamp: '14:46',
      status: 'read',
      isOwn: true,
      userId: '4',
    },
  ],
};

export default function ChatPage() {
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeUser = mockUsers.find((u) => u.id === activeUserId);
  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text: string, file?: File) => {
    if (!activeUserId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text || undefined,
      timestamp: new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sending',
      isOwn: true,
      userId: activeUserId,
    };

    if (file) {
      newMessage.document = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      };
    }

    setMessages((prev) => ({
      ...prev,
      [activeUserId]: [...(prev[activeUserId] || []), newMessage],
    }));

    // Simulate message status update
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeUserId]: prev[activeUserId].map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' as const } : msg
        ),
      }));
    }, 500);

    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeUserId]: prev[activeUserId].map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'received' as const } : msg
        ),
      }));
    }, 1000);
  };

  return (
    <div className='flex h-[calc(100vh-120px)] bg-white dark:bg-surface mb-8'>
      {/* Left sidebar - Users list */}
      <div className='w-80 border-r border-light-blue-gray dark:border-dark-gray flex flex-col'>
        {/* Search */}
        <div className='p-4 border-b border-light-blue-gray dark:border-dark-gray'>
          <InputField
            icon={<span className='material-symbols-outlined'>search</span>}
            placeholder='Найти чат...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            className='w-full text-lg dark:bg-dark-gray'
          />
        </div>

        {/* Users list */}
        <div className='flex-1 overflow-y-auto'>
          {filteredUsers.length > 0 ? (
            <div className='p-3 space-y-2'>
              {filteredUsers.map((user) => (
                <ChatUserCard
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  lastMessage={user.lastMessage}
                  avatar={user.avatar}
                  isActive={activeUserId === user.id}
                  onClick={() => setActiveUserId(user.id)}
                />
              ))}
            </div>
          ) : (
            <div className='flex items-center justify-center h-full text-gray dark:text-white'>
              <p className='text-lg'>Чаты не найдены</p>
            </div>
          )}
        </div>
      </div>

      {/* Right section - Chat area */}
      <div className='flex-1 flex flex-col bg-white dark:bg-surface'>
        {activeUser ? (
          <>
            {/* Header with user info */}
            <div className='border-b border-light-blue-gray dark:border-dark-gray py-3 px-4 bg-white dark:bg-surface text-start'>
              <h2 className='text-2xl font-semibold text-dark-gray dark:text-white'>
                {activeUser.fullName}
              </h2>
              <p className='text-base text-gray dark:text-white mt-1'>{activeUser.lastOnline}</p>
            </div>

            {/* Messages area */}
            <div className='flex-1 overflow-y-auto p-6 bg-white dark:bg-dark-gray'>
              {activeUserId && (messages[activeUserId]?.length ?? 0) > 0 ? (
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
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className='flex items-center justify-center h-full'>
                  <p className='text-lg text-gray dark:text-white'>Начните разговор!</p>
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
              <span className='material-symbols-outlined text-6xl text-light-blue-gray dark:text-cyan mb-4 block'>
                chat
              </span>
              <p className='text-gray dark:text-white text-2xl'>Выберите чат для начала общения</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
