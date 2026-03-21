'use client';

import { cn } from '@/lib/utils';

interface ChatUserCardProps {
  id: string;
  name: string;
  lastMessage: string;
  avatar?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function ChatUserCard({
  id,
  name,
  lastMessage,
  avatar,
  isActive = false,
  onClick,
}: ChatUserCardProps) {
  const isDefaultAvatar = !avatar || avatar === '/NoAvatarDefault.svg';

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3 rounded-lg cursor-pointer transition-colors duration-200',
        isActive
          ? 'bg-cyan'
          : 'hover:bg-light-blue-gray'
      )}
    >
      <div className='flex flex-row gap-3'>
        <div
          className={cn(
            'shrink-0 rounded-full overflow-hidden flex items-center justify-center w-14 h-14',
            isActive ? 'text-white' : 'text-orange'
          )}
        >
          {isDefaultAvatar ? (
            <svg width="54" height="54" viewBox="0 0 52 53" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="26" cy="26" r="24.5" stroke="currentColor" strokeWidth="3"/>
              <path d="M15.5713 36.5402V48.7668C15.5713 48.7668 17.7959 51.6779 25.8601 51.6779C33.9242 51.6779 36.4269 48.7668 36.4269 48.7668V36.5402C36.4269 33.0469 34.8975 26.9336 25.8601 26.9336C16.8226 26.9336 15.5713 33.1925 15.5713 36.5402Z" fill="currentColor" stroke="currentColor"/>
              <path d="M26.1396 12.2965C29.5279 12.2965 32.3133 15.1787 32.3135 18.7828C32.3135 22.3871 29.528 25.2701 26.1396 25.2701C22.7513 25.2701 19.9658 22.3871 19.9658 18.7828C19.966 15.1787 22.7514 12.2965 26.1396 12.2965Z" fill="currentColor" stroke="currentColor"/>
            </svg>
          ) : (
            <img
              src={avatar}
              alt={`Avatar`}
              className='w-full h-full object-cover rounded-full'
            />
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <p
            className={cn(
              'text-xl font-medium truncate',
              isActive ? 'text-white' : 'text-dark-gray'
            )}
          >
            {name}
          </p>
          <p
            className={cn(
              'text-base truncate',
              isActive ? 'text-white opacity-80' : 'text-gray'
            )}
          >
            {lastMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
