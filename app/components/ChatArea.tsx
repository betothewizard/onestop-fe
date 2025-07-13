import React, { useEffect, useRef } from 'react';
import { Message } from '../components/Message';
import { MessageSkeleton } from '../components/MessageSkeleton';
import { ChatInput } from '../components/ChatInput';
import { type Message as MessageType } from '../types/chat';

interface ChatAreaProps {
  messages: MessageType[];
  onSendMessage: (message: string, file?: File) => void;
  isLoading: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, onSendMessage, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-full">
          {messages.length === 0 && !isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center px-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Start a new conversation</h2>
                <p className="text-gray-600">Send a message to begin chatting with AI</p>
              </div>
            </div>
          ) : (
            <div>
              {messages.map((message, index) => (
                <Message key={index} message={message} />
              ))}
              {isLoading && <MessageSkeleton />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Container */}
      <div className="flex-shrink-0 border-t bg-white p-4">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};