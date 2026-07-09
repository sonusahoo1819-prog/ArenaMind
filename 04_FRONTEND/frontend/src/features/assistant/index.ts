export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  userId: string;
  messages: Message[];
  updatedAt: string;
}

export * from './assistantService';
export * from './useAssistantStore';
export * from './ChatPanel';

