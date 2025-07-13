import React from 'react';
import { Bot } from 'lucide-react';

export const MessageSkeleton: React.FC = () => {
  return (
    <div className="flex gap-4 p-6 bg-white w-full">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-green-600">
        <Bot size={16} />
      </div>
      
      <div className="flex-1 space-y-3 text-left">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '80%' }}></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '60%' }}></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '90%' }}></div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}; 