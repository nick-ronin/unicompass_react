'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import MaterialIcon from '@/components/MaterialIcon';

interface ChatMessageProps {
  text?: string;
  image?: string;
  document?: {
    name: string;
    size: string;
    url?: string;
    icon?: ReactNode;
  };
  caption?: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'received' | 'read';
  isOwn: boolean;
}

export default function ChatMessage({
  text,
  image,
  document,
  caption,
  timestamp,
  status,
  isOwn,
}: ChatMessageProps) {
  const getStatusIcon = () => {
    if (!isOwn) return null;
    const iconClass = 'w-4 h-4 text-xs';
    
    switch (status) {
      case 'sending':
        return <MaterialIcon name='schedule' className={`${iconClass} text-gray`} />;
      case 'sent':
        return <MaterialIcon name='check' className={`${iconClass} text-dark-gray`} />;
      case 'received':
        return <MaterialIcon name='done_all' className={`${iconClass} text-dark-gray`} />;
      case 'read':
        return <MaterialIcon name='done_all' className={`${iconClass} text-white`} />;
      default:
        return null;
    }
  };

  const bgColor = isOwn ? 'bg-cyan dark:bg-cyan' : 'bg-light-blue-gray dark:bg-surface';
  const textColor = isOwn ? 'text-white' : 'text-dark-gray dark:text-white';

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] sm:max-w-xs md:max-w-sm ${bgColor} rounded-2xl p-3`}>
        {/* Text message */}
        {text && (
          <p className={`${textColor} wrap-break-word text-base sm:text-lg`}>{text}</p>
        )}

        {/* Image */}
        {image && (
          <div className='mb-2'>
            <Image
              src={image}
              alt='Message image'
              width={240}
              height={240}
              className='w-full max-w-full rounded-lg object-cover'
            />
          </div>
        )}

        {/* Document */}
        {document && (
          <div className='flex items-center gap-3 mb-2 bg-white/20 rounded p-2'>
            <MaterialIcon name='description' className={textColor} />
            <div className='flex-1 min-w-0'>
              <p className={`${textColor} text-base truncate font-medium`}>
                {document.name}
              </p>
              <p className={`${textColor} text-sm opacity-70`}>
                {document.size}
              </p>
            </div>
          </div>
        )}

        {/* Caption */}
        {caption && (
          <p className={`${textColor} text-sm italic mt-2`}>{caption}</p>
        )}

        {/* Timestamp and Status */}
        <div className={`mt-2 flex items-center justify-between ${textColor} text-[10px] opacity-70 sm:text-xs`}>
          <span>{timestamp}</span>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
}
