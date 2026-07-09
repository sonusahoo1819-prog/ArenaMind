import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../types/enums';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async handleChat(userId: string, userRole: Role, message: string, conversationId?: string) {
    let conversation;
    if (conversationId) {
      conversation = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
      });
    }

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          userId,
          messages: '[]',
        },
      });
    }

    const messages = typeof conversation.messages === 'string'
      ? JSON.parse(conversation.messages)
      : (conversation.messages as any[] || []);
      
    messages.push({ role: 'user', content: message, timestamp: new Date() });

    const responseContent = await this.generateResponse(userRole, message, messages);

    messages.push({ role: 'assistant', content: responseContent, timestamp: new Date() });

    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { messages: JSON.stringify(messages) },
    });

    return {
      conversationId: conversation.id,
      reply: responseContent,
    };
  }

  private async generateResponse(role: Role, currentMessage: string, history: any[]): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your-gemini-api-key') {
      return this.generateFallbackResponse(role, currentMessage);
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      
      const contents = history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      const systemInstruction = `You are ArenaMind, the AI Operating System for Smart Stadiums during sporting events.
You are helping a user with the role of: ${role}.
Always tailor your suggestions to this role.
For FANS: Focus on food location, washrooms, seat navigation, parking, accessible routes.
For VOLUNTEERS: Focus on shift schedules, tasks, incident reporting.
For OPERATIONS/SECURITY: Provide stadium health dashboard values, incident triage.
Be brief, helpful, and highly structured in Markdown. Never hallucinate status.`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, I could not process your request.';
    } catch (error) {
      return this.generateFallbackResponse(role, currentMessage);
    }
  }

  private generateFallbackResponse(role: Role, message: string): string {
    const lower = message.toLowerCase();

    if (role === 'FAN') {
      if (lower.includes('gate') || lower.includes('navig') || lower.includes('seat')) {
        return `🏟️ **ArenaMind Navigation AI**\nYour seat is located in **Section 204, Row K, Seat 12**. \n- **Nearest Entrance:** Gate 4 (Accessible)\n- **Estimated Walk Time:** 4 minutes\n- **Congestion Level:** Low (Green)`;
      }
      if (lower.includes('food') || lower.includes('eat') || lower.includes('drink')) {
        return `🍔 **ArenaMind Services**\nHere are the nearest food options to Section 204:\n1. **Stadium Burgers & Dogs** (Section 206) - 2 min walk, Queue: 5 mins\n2. **Eco Refreshments** (Section 202 - Carbon neutral) - 3 min walk, Queue: 2 mins`;
      }
      if (lower.includes('parking') || lower.includes('car') || lower.includes('transport')) {
        return `🚗 **ArenaMind Transport AI**\n- **Your Parking Zone:** Zone B (Spot 42)\n- **Shuttle Service:** Shuttle 3 departs every 5 minutes from Gate 4 to Zone B.\n- **Traffic Status:** Mild delay near exit highways. We recommend waiting 15 mins post-match.`;
      }
      return `👋 Hello! I am ArenaMind, your Smart Stadium Assistant. How can I help you find your seat, locate food stalls, navigate entrances, or coordinate transport today?`;
    }

    if (role === 'VOLUNTEER') {
      return `📋 **ArenaMind Volunteer AI**\n- **Current Shift:** 16:00 - 20:00 at Gate 4 Info Desk.\n- **Assigned Tasks:** Assist fans finding wheelchair routes.\n- **Report Incident:** Type "/report [description]" to log any security or medical incident immediately.`;
    }

    if (role === 'OPERATIONS' || role === 'ADMIN' || role === 'SECURITY') {
      return `⚙️ **ArenaMind Operations AI**\n- **Stadium Health Score:** 94/100\n- **Total Fans:** 68,432 / 80,000 capacity\n- **Crowd Congestion:** High near Gate 2. AI route optimization active; fans redirected to Gate 4.\n- **Active Incidents:** 1 unresolved medical alert in Section 105 (Medical Responder dispatched, ETA 3 mins).`;
    }

    return `I am ArenaMind Stadium OS. Please let me know how I can assist with stadium navigation, crowd management, or emergency services.`;
  }
}
