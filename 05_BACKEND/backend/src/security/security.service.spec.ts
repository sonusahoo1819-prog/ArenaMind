import { Test, TestingModule } from '@nestjs/testing';
import { SecurityService } from './security.service';
import { PrismaService } from '../prisma/prisma.service';
import { IncidentStatus } from '../types/enums';
import { NotFoundException } from '@nestjs/common';

describe('SecurityService', () => {
  let service: SecurityService;
  let prisma: PrismaService;

  const mockIncident = {
    id: 'inc-123',
    title: 'Scanner down',
    description: 'Broken gate gate scanner',
    type: 'SECURITY',
    status: 'REPORTED',
    location: JSON.stringify({ zoneId: 'Gate A' }),
    reporterId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityService,
        {
          provide: PrismaService,
          useValue: {
            incident: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SecurityService>(SecurityService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createIncident', () => {
    it('should successfully create and return incident record', async () => {
      (prisma.incident.create as jest.Mock).mockResolvedValueOnce(mockIncident);

      const result = await service.createIncident('user-1', {
        title: 'Scanner down',
        description: 'Broken gate gate scanner',
        type: 'SECURITY',
        location: { zoneId: 'Gate A' },
      });

      expect(result).toEqual(mockIncident);
      expect(prisma.incident.create).toHaveBeenCalledWith({
        data: {
          title: 'Scanner down',
          description: 'Broken gate gate scanner',
          type: 'SECURITY',
          status: 'REPORTED',
          location: JSON.stringify({ zoneId: 'Gate A' }),
          reporterId: 'user-1',
        },
      });
    });
  });

  describe('getActiveIncidents', () => {
    it('should fetch and parse active security incidents', async () => {
      (prisma.incident.findMany as jest.Mock).mockResolvedValueOnce([mockIncident]);

      const result = await service.getActiveIncidents();

      expect(result).toEqual([
        {
          ...mockIncident,
          location: { zoneId: 'Gate A' },
        },
      ]);
    });
  });

  describe('updateIncidentStatus', () => {
    it('should throw NotFoundException if incident does not exist', async () => {
      (prisma.incident.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        service.updateIncidentStatus('non-existent', IncidentStatus.RESOLVED)
      ).rejects.toThrow(NotFoundException);
    });

    it('should update and return updated incident', async () => {
      (prisma.incident.findUnique as jest.Mock).mockResolvedValueOnce(mockIncident);
      (prisma.incident.update as jest.Mock).mockResolvedValueOnce({
        ...mockIncident,
        status: 'RESOLVED',
      });

      const result = await service.updateIncidentStatus('inc-123', IncidentStatus.RESOLVED);
      expect(result.status).toBe('RESOLVED');
    });
  });

  describe('triggerSOS', () => {
    it('should trigger emergency panic alert incident', async () => {
      (prisma.incident.create as jest.Mock).mockResolvedValueOnce({
        ...mockIncident,
        title: 'EMERGENCY SOS ALERT',
        type: 'SOS',
      });

      const result = await service.triggerSOS('user-1', { zoneId: 'Current Zone' });
      expect(result.type).toBe('SOS');
    });
  });
});
