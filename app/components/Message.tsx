import React, { useState } from 'react';
import { Copy, Check, User, Bot } from 'lucide-react';
import { type Message as MessageType } from '../types/chat';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'requester';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`flex gap-4 p-6 ${isUser ? 'bg-gray-50' : 'bg-white'}`}>
      <div className={`${isUser ? 'order-last' : ''} flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-purple-600' : 'bg-green-600'
      }`}>
        {isUser ? <User size={16} color='white' /> : <Bot size={16} color='white' />}
      </div>

      <div className={`flex-1 space-y-3 ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`${isUser ? 'ml-auto' : 'mr-auto'} max-w-[800px]`}>
          <p className="whitespace-pre-wrap break-words">{message.message}</p>
        </div>
        
        <div className={`flex items-center gap-2 text-xs text-gray-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
          {message.timestamp && (
            <span className="flex-shrink-0">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};