export interface CrowdMetric {
  id: string;
  zoneId: string;
  densityScore: number; // 0.0 to 1.0
  queueLength: number;
  waitTimeMin: number;
  createdAt: string;
}

export interface CrowdZone {
  id: string;
  name: string;
  currentDensity: number;
  status: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export * from './crowdService';
export * from './CrowdPanel';

