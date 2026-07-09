import { create } from 'zustand';
import { Message } from './index';
import { assistantService } from './assistantService';

interface AssistantState {
  conversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string, token: string) => Promise<void>;
  clearConversation: () => void;
}

export const useAssistantStore = create<AssistantState>((set, get) => ({
  conversationId: null,
  messages: [],
  isLoading: false,
  error: null,

  sendMessage: async (content, token) => {
    const { conversationId, messages } = get();
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    set({
      messages: [...messages, userMessage],
      isLoading: true,
      error: null,
    });

    try {
      const data = await assistantService.sendMessage(content, token, conversationId || undefined);
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
      };
      set({
        conversationId: data.conversationId,
        messages: [...get().messages, assistantMessage],
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  clearConversation: () => {
    set({ conversationId: null, messages: [], error: null });
  },
}));
