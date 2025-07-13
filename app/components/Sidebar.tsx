import React, { useState } from 'react';
import { PlusCircle, MessageSquare, MoreVertical, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Chat } from '../types/chat';

interface SidebarProps {
  chats: Chat[];
  currentChatId: number | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectChat: (chatId: number) => void;
  onNewChat: () => void;
  onRenameChat: (chatId: number, newName: string) => void;
  onDeleteChat: (chatId: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  currentChatId,
  isCollapsed,
  onToggleCollapse,
  onSelectChat,
  onNewChat,
  onRenameChat,
  onDeleteChat,
}) => {
  const [editingChatId, setEditingChatId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const sortedChats = [...chats].sort((a, b) => b.lastUpdated - a.lastUpdated);

  const handleRename = (chatId: number, currentName: string) => {
    setEditingChatId(chatId);
    setEditingName(currentName);
    setActiveDropdown(null);
  };

  const saveRename = () => {
    if (editingChatId && editingName.trim()) {
      onRenameChat(editingChatId, editingName.trim());
    }
    setEditingChatId(null);
    setEditingName('');
  };

  const cancelRename = () => {
    setEditingChatId(null);
    setEditingName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveRename();
    } else if (e.key === 'Escape') {
      cancelRename();
    }
  };

  return (
    <div className={`bg-gray-900 border-r border-gray-700 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-semibold text-white">T3Chat</h1>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="p-4">
        <button
          onClick={onNewChat}
          className={`w-full flex items-center gap-3 p-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <PlusCircle size={20} />
          {!isCollapsed && 'New Chat'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedChats.map((chat) => (
          <div key={chat.id} className="px-4 py-1">
            <div
              className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                currentChatId === chat.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <MessageSquare size={20} className="flex-shrink-0" />
              
              {!isCollapsed && (
                <>
                  {editingChatId === chat.id ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={saveRename}
                      onKeyDown={handleKeyPress}
                      className="flex-1 bg-gray-600 text-white px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="flex-1 text-sm truncate">{chat.name}</span>
                  )}
                  
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === chat.id ? null : chat.id);
                      }}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-600 transition-all"
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    {activeDropdown === chat.id && (
                      <div className="absolute right-0 top-8 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-32">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRename(chat.id, chat.name);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          <Edit2 size={14} />
                          Rename
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(chat.id);
                            setActiveDropdown(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};