import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { NavigationModule } from './navigation/navigation.module';
import { CrowdModule } from './crowd/crowd.module';
import { TransportModule } from './transport/transport.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [PrismaModule, AuthModule, AiModule, NavigationModule, CrowdModule, TransportModule, AnalyticsModule, SecurityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}







