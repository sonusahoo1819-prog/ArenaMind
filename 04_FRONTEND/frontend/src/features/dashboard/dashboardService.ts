const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface GateStatus {
  gate: string;
  status: 'OPEN' | 'CLOSED';
  throughput: number;
}

export interface StadiumMetrics {
  healthScore: number;
  activeIncidentsCount: number;
  totalTicketsScanned: number;
  avgWaitTimeMinutes: number;
  gateStatus: GateStatus[];
  systemLoadPercent: number;
  lastUpdated: string;
}

export const dashboardService = {
  async getDashboardMetrics(token: string): Promise<StadiumMetrics> {
    const response = await fetch(`${API_URL}/analytics/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to fetch dashboard metrics');
    }
    return response.json();
  },
};
