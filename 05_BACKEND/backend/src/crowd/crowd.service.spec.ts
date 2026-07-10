import { Test, TestingModule } from '@nestjs/testing';
import { CrowdService } from './crowd.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CrowdService', () => {
  let service: CrowdService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrowdService,
        {
          provide: PrismaService,
          useValue: {
            crowdMetric: {
              create: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CrowdService>(CrowdService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logMetric', () => {
    it('should create and log new crowd metric', async () => {
      const mockMetric = {
        id: '1',
        zoneId: 'Gate 1',
        densityScore: 0.85,
        queueLength: 20,
        waitTimeMin: 7,
      };
      (prisma.crowdMetric.create as jest.Mock).mockResolvedValueOnce(mockMetric);

      const result = await service.logMetric({
        zoneId: 'Gate 1',
        densityScore: 0.85,
        queueLength: 20,
        waitTimeMin: 7,
      });

      expect(result).toEqual(mockMetric);
    });
  });

  describe('getLatestMetrics', () => {
    it('should fetch latest metrics when database records exist', async () => {
      const mockRecord = {
        id: '1',
        zoneId: 'Gate 1',
        densityScore: 0.85,
        queueLength: 20,
        waitTimeMin: 7,
        createdAt: new Date(),
      };
      (prisma.crowdMetric.findFirst as jest.Mock).mockResolvedValue(mockRecord);

      const result = await service.getLatestMetrics();
      expect(result[0].id).toBe('1');
    });

    it('should fallback to default metrics if database records are empty', async () => {
      (prisma.crowdMetric.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await service.getLatestMetrics();
      expect(result.length).toBe(16); // 16 zones
      expect(result[0].id).toContain('mock-id-');
    });
  });

  describe('getPredictions', () => {
    it('should generate predictions based on offset time multiplier', async () => {
      (prisma.crowdMetric.findFirst as jest.Mock).mockResolvedValue(null);

      const predictions = await service.getPredictions(60);
      expect(predictions[0].timeOffsetMinutes).toBe(60);
      expect(predictions[0].predictedDensity).toBeLessThanOrEqual(1.0);
    });
  });
});
