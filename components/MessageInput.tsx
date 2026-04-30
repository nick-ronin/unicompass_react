'use client';

import { useState } from 'react';
import Button from './Button';
import MaterialIcon from '@/components/MaterialIcon';

interface MessageInputProps {
  onSendMessage: (message: string, file?: File) => void;
  placeholder?: string;
}

export default function MessageInput({
  onSendMessage,
  placeholder = 'Enter message...',
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
    <div className='border-t border-light-blue-gray bg-white p-3 dark:border-dark-gray dark:bg-surface sm:p-4'>
      {attachedFile && (
        <div className='mb-3 flex items-center gap-2 bg-light-blue-gray dark:bg-dark-gray rounded p-2'>
          <MaterialIcon name='attachment' className='text-dark-gray dark:text-white text-2xl' />
          <span className='text-base text-dark-gray dark:text-white flex-1 truncate'>
            {attachedFile.name}
          </span>
          <button
            onClick={() => setAttachedFile(null)}
            className='text-gray dark:text-medium-blue-gray hover:text-dark-gray dark:hover:text-white'
          >
            <MaterialIcon name='close' />
          </button>
        </div>
      )}

      <div className='flex items-end gap-2 sm:gap-3'>
        <label className='flex items-center justify-center cursor-pointer'>
          <MaterialIcon name='attach_file' className='text-cyan dark:text-cyan hover:text-dark-cyan dark:hover:text-dark-cyan text-2xl' />
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
          className='flex-1 min-h-11 resize-none rounded-lg bg-white p-3 text-sm text-dark-gray focus:outline-none focus:ring-1 focus:ring-cyan dark:bg-dark-gray dark:text-white sm:text-base max-h-24'
          rows={1}
        />

        <Button
          onClick={handleSendMessage}
          className='flex items-center justify-center rounded-lg bg-cyan px-3 py-3 text-white hover:bg-dark-cyan dark:bg-cyan dark:hover:bg-dark-cyan sm:px-4'
          icon={<MaterialIcon name='send' />}
          iconPosition='right'
        >
          <span className='hidden sm:inline'>Send</span>
        </Button>
      </div>
    </div>
  );
}
