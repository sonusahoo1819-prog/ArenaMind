import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { IncidentStatus } from '../types/enums';

@Injectable()
export class SecurityService {
  constructor(private prisma: PrismaService) {}

  async createIncident(reporterId: string, dto: CreateIncidentDto) {
    return this.prisma.incident.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type,
        status: 'REPORTED',
        location: JSON.stringify(dto.location),
        reporterId,
      },
    });
  }

  async getActiveIncidents() {
    const list = await this.prisma.incident.findMany({
      where: {
        status: { in: ['REPORTED', 'DISPATCHED'] },
      },
      orderBy: { createdAt: 'desc' },
    });
    return list.map((inc) => ({
      ...inc,
      location: typeof inc.location === 'string' ? JSON.parse(inc.location) : inc.location,
    }));
  }

  async updateIncidentStatus(incidentId: string, status: IncidentStatus) {
    const incident = await this.prisma.incident.findUnique({
      where: { id: incidentId },
    });

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    return this.prisma.incident.update({
      where: { id: incidentId },
      data: { status },
    });
  }

  async triggerSOS(reporterId: string, location: any) {
    // Generate an instant SOS emergency incident
    return this.prisma.incident.create({
      data: {
        title: 'EMERGENCY SOS ALERT',
        description: 'User initiated panic emergency signal. Medical or security assistance requested immediately.',
        type: 'SOS',
        status: 'REPORTED',
        location: JSON.stringify(location),
        reporterId,
      },
    });
  }
}
