import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getStadiumMetrics() {
    const activeIncidents = await this.prisma.incident.count({
      where: { status: { in: ['REPORTED', 'DISPATCHED'] } },
    });

    const activeTickets = await this.prisma.ticket.count();
    
    // Aggregate average wait times
    const crowdMetrics = await this.prisma.crowdMetric.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    
    const avgWaitTime = crowdMetrics.length > 0
      ? Math.round(crowdMetrics.reduce((sum, m) => sum + m.waitTimeMin, 0) / crowdMetrics.length)
      : 3;

    // Simulate high-fidelity operational command center values
    const healthScore = Math.max(70, 100 - activeIncidents * 8);

    return {
      healthScore,
      activeIncidentsCount: activeIncidents,
      totalTicketsScanned: activeTickets || 4253,
      avgWaitTimeMinutes: avgWaitTime,
      gateStatus: [
        { gate: 'Gate 1', status: 'OPEN', throughput: 1420 },
        { gate: 'Gate 2', status: 'OPEN', throughput: 980 },
        { gate: 'Gate 3', status: 'OPEN', throughput: 1150 },
        { gate: 'Gate 4', status: 'OPEN', throughput: 703 },
      ],
      systemLoadPercent: 42,
      lastUpdated: new Date(),
    };
  }
}
