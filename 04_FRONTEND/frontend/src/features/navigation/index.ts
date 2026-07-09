export interface Coordinate {
  lat: number;
  lng: number;
}

export interface NavigationRoute {
  id: string;
  startPoint: string;
  endPoint: string;
  isAccessible: boolean;
  isEmergency: boolean;
  routeData: {
    coordinates: Coordinate[];
    instructions: string[];
    estimatedTimeMin: number;
    distanceMeters: number;
  };
  crowdMetadata?: {
    queueTimeMin: number;
    congestionLevel: string;
    delayReason?: string;
  };
}

export * from './navigationService';
export * from './NavigationPanel';

