import { type ChatRequest, type ChatResponse, type Message } from '../types/chat';

// Mock responses for demonstration
const mockResponses = [
  "I understand your question. Let me help you with that.",
  "That's an interesting point. Here's what I think about it...",
  "Based on the information provided, I would suggest...",
  "I can definitely help you with this. Let me break it down:",
  "Great question! The answer depends on several factors...",
  "I see what you're asking. The key thing to understand is...",
  "Let me provide you with a comprehensive response to that.",
  "That's a common question, and here's the best approach...",
];

let conversationCounter = 1;
const conversations = new Map<number, Message[]>();

export const mockChatApi = async (request: ChatRequest): Promise<ChatResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  const conversationId = request.conversationId || conversationCounter++;
  
  // Get existing messages or create new conversation
  const existingMessages = conversations.get(conversationId) || [];
  
  // Add user message
  const userMessage: Message = {
    role: 'requester',
    message: request.chat,
    timestamp: Date.now()
  };
  
  // Generate AI response
  const responseMessage: Message = {
    role: 'responser',
    message: mockResponses[Math.floor(Math.random() * mockResponses.length)],
    timestamp: Date.now() + 1000
  };
  
  // Update conversation
  const updatedMessages = [...existingMessages, userMessage, responseMessage];
  conversations.set(conversationId, updatedMessages);
  
  return {
    code: 200,
    message: "Success",
    data: {
      conversationId,
      messages: updatedMessages
    }
  };
};