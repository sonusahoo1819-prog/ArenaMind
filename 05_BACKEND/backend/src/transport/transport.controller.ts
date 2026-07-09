import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TransportService } from './transport.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../types/enums';

@Controller('transport')
@UseGuards(JwtAuthGuard)
export class TransportController {
  constructor(private transportService: TransportService) {}

  @Get('parking')
  async getParking() {
    return this.transportService.getParkingStatus();
  }

  @Get('shuttles')
  async getShuttles() {
    return this.transportService.getShuttleStatus();
  }

  @Post('parking')
  @UseGuards(RolesGuard)
  @Roles(Role.OPERATIONS, Role.ADMIN)
  async updateParking(@Body() body: { zoneId: string; occupiedSpots: number }) {
    return this.transportService.updateParkingOccupancy(body.zoneId, body.occupiedSpots);
  }

  @Post('shuttle')
  @UseGuards(RolesGuard)
  @Roles(Role.OPERATIONS, Role.ADMIN)
  async updateShuttle(@Body() body: { shuttleId: string; status: string; nextArrivalMin: number }) {
    return this.transportService.updateShuttleStatus(body.shuttleId, body.status, body.nextArrivalMin);
  }
}
