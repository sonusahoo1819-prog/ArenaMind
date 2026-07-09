import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('navigation')
@UseGuards(JwtAuthGuard)
export class NavigationController {
  constructor(private navigationService: NavigationService) {}

  @Post('route')
  async create(@Body() dto: CreateRouteDto) {
    return this.navigationService.create(dto);
  }

  @Get('route')
  async getRoute(
    @Query('start') startPoint: string,
    @Query('end') endPoint: string,
    @Query('accessible') accessible?: string,
    @Query('emergency') emergency?: string,
  ) {
    const isAccessible = accessible === 'true';
    const isEmergency = emergency === 'true';
    return this.navigationService.calculateRoute(startPoint, endPoint, isAccessible, isEmergency);
  }
}
