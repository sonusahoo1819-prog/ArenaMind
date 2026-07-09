import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  async chat(@Body() dto: ChatRequestDto, @Req() req: any) {
    const user = req.user;
    return this.aiService.handleChat(user.id, user.role, dto.message, dto.conversationId);
  }
}
