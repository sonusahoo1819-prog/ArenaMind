const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ChatReply {
  conversationId: string;
  reply: string;
}

export const assistantService = {
  async sendMessage(message: string, token: string, conversationId?: string): Promise<ChatReply> {
    const response = await fetch(`${API_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message, conversationId }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to send message');
    }
    return response.json();
  },
};
