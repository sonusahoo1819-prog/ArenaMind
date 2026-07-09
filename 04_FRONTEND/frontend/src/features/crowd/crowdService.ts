import { CrowdMetric } from './index';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface PredictionData {
  zoneId: string;
  currentDensity: number;
  predictedDensity: number;
  predictedQueue: number;
  predictedWait: number;
  timeOffsetMinutes: number;
  status: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export const crowdService = {
  async getStatus(token: string): Promise<CrowdMetric[]> {
    const response = await fetch(`${API_URL}/crowd/status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to fetch crowd status');
    }
    return response.json();
  },

  async getPredictions(token: string, offsetMinutes = 30): Promise<PredictionData[]> {
    const response = await fetch(`${API_URL}/crowd/prediction?offset=${offsetMinutes}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to fetch crowd predictions');
    }
    return response.json();
  },
};
