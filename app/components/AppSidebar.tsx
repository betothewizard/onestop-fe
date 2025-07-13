import React, { useState } from 'react';
import { PlusCircle, MessageSquare, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import type { Chat } from '../types/chat';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface AppSidebarProps {
  chats: Chat[];
  currentChatId: number | null;
  onSelectChat: (chatId: number) => void;
  onNewChat: () => void;
  onRenameChat: (chatId: number, newName: string) => void;
  onDeleteChat: (chatId: number) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onRenameChat,
  onDeleteChat,
}) => {
  const [editingChatId, setEditingChatId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const sortedChats = [...chats].sort((a, b) => b.lastUpdated - a.lastUpdated);

  const handleRename = (chatId: number, currentName: string) => {
    setEditingChatId(chatId);
    setEditingName(currentName);
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
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">T3Chat</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
            >
              <PlusCircle size={20} />
              New Chat
            </button>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sortedChats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    isActive={currentChatId === chat.id}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <MessageSquare size={20} className="flex-shrink-0" />
                    <span className="flex-1 text-sm truncate">
                      {editingChatId === chat.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={handleKeyPress}
                          onBlur={saveRename}
                          className="bg-transparent border-none outline-none text-white w-full"
                          autoFocus
                        />
                      ) : (
                        chat.name
                      )}
                    </span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction>
                        <MoreVertical size={16} />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuItem onClick={() => handleRename(chat.id, chat.name)}>
                        <Edit2 size={16} className="mr-2" />
                        <span>Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteChat(chat.id)}>
                        <Trash2 size={16} className="mr-2" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}; 