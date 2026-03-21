'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

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
    const iconClass = 'w-4 h-4 material-symbols-outlined text-xs';
    
    switch (status) {
      case 'sending':
        return <span className={`${iconClass} text-gray`}>schedule</span>;
      case 'sent':
        return <span className={`${iconClass} text-dark-gray`}>check</span>;
      case 'received':
        return <span className={`${iconClass} text-dark-gray`}>done_all</span>;
      case 'read':
        return <span className={`${iconClass} text-cyan`}>done_all</span>;
      default:
        return null;
    }
  };

  const bgColor = isOwn ? 'bg-cyan dark:bg-cyan' : 'bg-light-blue-gray dark:bg-surface-secondary';
  const textColor = isOwn ? 'text-white' : 'text-dark-gray dark:text-white';

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs ${bgColor} rounded-lg p-3`}>
        {/* Text message */}
        {text && (
          <p className={`${textColor} text-base wrap-break-word`}>{text}</p>
        )}

        {/* Image */}
        {image && (
          <div className='mb-2'>
            <Image
              src={image}
              alt='Message image'
              width={240}
              height={240}
              className='rounded-lg max-w-xs object-cover'
            />
          </div>
        )}

        {/* Document */}
        {document && (
          <div className='flex items-center gap-3 mb-2 bg-white/20 rounded p-2'>
            <span className={`material-symbols-outlined ${textColor}`}>
              description
            </span>
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
        <div className={`flex justify-between items-center mt-2 ${textColor} text-xs opacity-70`}>
          <span>{timestamp}</span>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
}
