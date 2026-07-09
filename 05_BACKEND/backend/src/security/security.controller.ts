import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { SecurityService } from './security.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { IncidentStatus, Role } from '../types/enums';

@Controller('security')
@UseGuards(JwtAuthGuard)
export class SecurityController {
  constructor(private securityService: SecurityService) {}

  @Post('incident')
  async createIncident(@Body() dto: CreateIncidentDto, @Req() req: any) {
    return this.securityService.createIncident(req.user.id, dto);
  }

  @Get('incidents')
  @UseGuards(RolesGuard)
  @Roles(Role.SECURITY, Role.OPERATIONS, Role.ADMIN)
  async getActive() {
    return this.securityService.getActiveIncidents();
  }

  @Patch('incident/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.SECURITY, Role.OPERATIONS, Role.ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: IncidentStatus) {
    return this.securityService.updateIncidentStatus(id, status);
  }

  @Post('sos')
  async triggerSOS(@Body() body: { location: any }, @Req() req: any) {
    return this.securityService.triggerSOS(req.user.id, body.location);
  }
}
