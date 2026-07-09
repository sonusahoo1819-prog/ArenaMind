import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMetricDto } from './dto/create-metric.dto';

@Injectable()
export class CrowdService {
  constructor(private prisma: PrismaService) {}

  async logMetric(dto: CreateMetricDto) {
    return this.prisma.crowdMetric.create({
      data: {
        zoneId: dto.zoneId,
        densityScore: dto.densityScore,
        queueLength: dto.queueLength,
        waitTimeMin: dto.waitTimeMin,
      },
    });
  }

  async getLatestMetrics() {
    const zones = [
      'Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5', 'Gate 6', 'Gate 7', 'Gate 8',
      'Concourse East', 'Concourse West', 'Food Court A', 'Food Court B',
      'Parking Zone A', 'Parking Zone B', 'VVIP Luxury Lot', 'Media Sector Hub'
    ];
    const metrics: any[] = [];

    for (const zoneId of zones) {
      // Find latest logged metric for this zone
      const latest = await this.prisma.crowdMetric.findFirst({
        where: { zoneId },
        orderBy: { createdAt: 'desc' },
      });

      if (latest) {
        metrics.push(latest);
      } else {
        // Varied realistic defaults instead of flat dummy metrics
        let defaultDensity = 0.38;
        let defaultQueue = 9;
        let defaultWait = 3;

        if (zoneId === 'Gate 1' || zoneId === 'Gate 5') {
          defaultDensity = 0.88;
          defaultQueue = 42;
          defaultWait = 14;
        } else if (zoneId === 'Gate 3' || zoneId === 'Gate 7') {
          defaultDensity = 0.72;
          defaultQueue = 28;
          defaultWait = 9;
        } else if (zoneId === 'Gate 8' || zoneId === 'VVIP Luxury Lot') {
          defaultDensity = 0.18;
          defaultQueue = 3;
          defaultWait = 1;
        } else if (zoneId.includes('Food Court')) {
          defaultDensity = 0.65;
          defaultQueue = 18;
          defaultWait = 6;
        }

        metrics.push({
          id: 'mock-id-' + zoneId,
          zoneId,
          densityScore: defaultDensity,
          queueLength: defaultQueue,
          waitTimeMin: defaultWait,
          createdAt: new Date(),
        });
      }
    }

    return metrics;
  }

  async getPredictions(timeOffsetMinutes = 30) {
    const latest = await this.getLatestMetrics();
    
    return latest.map((metric) => {
      const multiplier = 1 + (timeOffsetMinutes / 60) * 0.45;
      const predictedDensity = Math.min(1.0, metric.densityScore * multiplier);
      const predictedQueue = Math.round(metric.queueLength * multiplier);
      const MathWait = Math.round(metric.waitTimeMin * multiplier);

      return {
        zoneId: metric.zoneId,
        currentDensity: metric.densityScore,
        predictedDensity,
        predictedQueue,
        predictedWait: MathWait,
        timeOffsetMinutes,
        status: predictedDensity > 0.85 ? 'CRITICAL' : predictedDensity > 0.65 ? 'HIGH' : predictedDensity > 0.35 ? 'MEDIUM' : 'LOW',
      };
    });
  }
}
