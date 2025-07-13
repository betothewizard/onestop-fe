import type { Route } from "./+types/app";
import React, { useState, useCallback } from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { ChatArea } from '../components/ChatArea';
import { type Chat, type Message } from '../types/chat';
import { mockChatApi } from '../services/chat';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "BOT" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentChat = chats.find(chat => chat.id === currentChatId);

  const createNewChat = useCallback(() => {
    const newChatId = Date.now();
    const newChat: Chat = {
      id: newChatId,
      name: 'New Chat',
      messages: [],
      lastUpdated: Date.now(),
    };

    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
  }, []);

  const selectChat = useCallback((chatId: number) => {
    setCurrentChatId(chatId);
  }, []);

  const renameChat = useCallback((chatId: number, newName: string) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId
        ? { ...chat, name: newName, lastUpdated: Date.now() }
        : chat
    ));
  }, []);

  const deleteChat = useCallback((chatId: number) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  }, [currentChatId]);

  const sendMessage = useCallback(async (message: string, file?: File) => {
    if (!message.trim() && !file) return;

    let chatId = currentChatId;

    // Create new chat if none exists
    if (!chatId) {
      chatId = Date.now();
      const newChat: Chat = {
        id: chatId,
        name: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
        messages: [],
        lastUpdated: Date.now(),
      };

      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(chatId);
    }

    // Prepare message text
    let messageText = message;
    if (file) {
      messageText += file ? ` [File: ${file.name}]` : '';
    }

    // Immediately add user message to the chat
    const userMessage: Message = {
      role: 'requester',
      message: messageText,
      timestamp: Date.now()
    };

    setChats(prev => prev.map(chat =>
      chat.id === chatId
        ? {
          ...chat,
          messages: [...chat.messages, userMessage],
          lastUpdated: Date.now(),
          name: chat.name === 'New Chat' ? (message.slice(0, 50) + (message.length > 50 ? '...' : '')) : chat.name
        }
        : chat
    ));

    // Set loading state only if not already loading
    if (!isLoading) {
      setIsLoading(true);
    }

    try {
      const response = await mockChatApi({
        conversationId: chatId,
        chat: messageText,
      });

      if (response.code === 200) {
        setChats(prev => prev.map(chat =>
          chat.id === chatId
            ? {
              ...chat,
              messages: response.data.messages,
              lastUpdated: Date.now(),
              name: chat.name === 'New Chat' ? (message.slice(0, 50) + (message.length > 50 ? '...' : '')) : chat.name
            }
            : chat
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      // Only stop loading if this was the last message in the queue
      // For now, we'll keep it simple and stop loading after each response
      setIsLoading(false);
    }
  }, [currentChatId, isLoading]);

  // Start with a new chat if no chats exist
  React.useEffect(() => {
    if (chats.length === 0 && currentChatId === null) {
      // Don't auto-create, let user start fresh
    }
  }, [chats.length, currentChatId]);

  return (
    <SidebarProvider>
      <AppSidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={selectChat}
        onNewChat={createNewChat}
        onRenameChat={renameChat}
        onDeleteChat={deleteChat}
      />
      <SidebarInset>
        <main className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <SidebarTrigger />
          </div>
          <ChatArea
            messages={currentChat?.messages || []}
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;