import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { CrowdService } from './crowd.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../types/enums';

@Controller('crowd')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CrowdController {
  constructor(private crowdService: CrowdService) {}

  @Post('metric')
  @Roles(Role.OPERATIONS, Role.ADMIN, Role.SECURITY)
  async logMetric(@Body() dto: CreateMetricDto) {
    return this.crowdService.logMetric(dto);
  }

  @Get('status')
  async getStatus() {
    return this.crowdService.getLatestMetrics();
  }

  @Get('prediction')
  async getPrediction(@Query('offset') offset?: string) {
    const timeOffset = offset ? parseInt(offset, 10) : 30;
    return this.crowdService.getPredictions(timeOffset);
  }
}
