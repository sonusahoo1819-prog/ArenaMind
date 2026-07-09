const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ParkingZone {
  zoneId: string;
  name: string;
  totalSpots: number;
  occupiedSpots: number;
}

export interface ShuttleLine {
  shuttleId: string;
  name: string;
  status: string;
  nextArrivalMin: number;
  route: string;
}

export const transportService = {
  async getParking(token: string): Promise<ParkingZone[]> {
    const response = await fetch(`${API_URL}/transport/parking`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to fetch parking status');
    }
    return response.json();
  },

  async getShuttles(token: string): Promise<ShuttleLine[]> {
    const response = await fetch(`${API_URL}/transport/shuttles`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to fetch shuttles');
    }
    return response.json();
  },
};
