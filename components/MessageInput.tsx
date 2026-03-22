'use client';

import { useState, ReactNode } from 'react';
import Button from './Button';

interface MessageInputProps {
  onSendMessage: (message: string, file?: File) => void;
  placeholder?: string;
}

export default function MessageInput({
  onSendMessage,
  placeholder = 'Введите сообщение...',
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const handleSendMessage = () => {
    if (message.trim() || attachedFile) {
      onSendMessage(message, attachedFile || undefined);
      setMessage('');
      setAttachedFile(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  return (
    <div className='bg-white dark:bg-surface border-t border-light-blue-gray dark:border-dark-gray p-4'>
      {attachedFile && (
        <div className='mb-3 flex items-center gap-2 bg-light-blue-gray dark:bg-dark-gray rounded p-2'>
          <span className='material-symbols-outlined text-dark-gray dark:text-white text-2xl'>
            attachment
          </span>
          <span className='text-base text-dark-gray dark:text-white flex-1 truncate'>
            {attachedFile.name}
          </span>
          <button
            onClick={() => setAttachedFile(null)}
            className='text-gray dark:text-medium-blue-gray hover:text-dark-gray dark:hover:text-white material-symbols-outlined'
          >
            close
          </button>
        </div>
      )}

      <div className='flex gap-3'>
        <label className='flex items-center justify-center cursor-pointer'>
          <span className='material-symbols-outlined text-cyan dark:text-cyan hover:text-dark-cyan dark:hover:text-dark-cyan text-2xl'>
            attach_file
          </span>
          <input
            type='file'
            onChange={handleFileAttach}
            className='hidden'
            accept='image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt'
          />
        </label>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className='flex-1 resize-none rounded-lg p-3 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan text-dark-gray dark:text-white bg-white dark:bg-dark-gray text-base max-h-24'
          rows={1}
        />

        <Button
          onClick={handleSendMessage}
          className='bg-cyan dark:bg-cyan hover:bg-dark-cyan dark:hover:bg-dark-cyan text-white rounded-lg px-4 py-3 flex items-center justify-center'
          icon={<span className='material-symbols-outlined'>send</span>}
          iconPosition='right'
        >
          <span className='hidden sm:inline'>Отправить</span>
        </Button>
      </div>
    </div>
  );
}
