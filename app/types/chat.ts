export interface Message {
    role: 'requester' | 'responser';
    message: string;
    timestamp?: number;
  }
  
  export interface Chat {
    id: number;
    name: string;
    messages: Message[];
    lastUpdated: number;
  }
  
  export interface ChatResponse {
    code: number;
    message: string;
    data: {
      conversationId: number;
      messages: Message[];
    };
  }
  
  export interface ChatRequest {
    conversationId?: number;
    chat: string;
  }