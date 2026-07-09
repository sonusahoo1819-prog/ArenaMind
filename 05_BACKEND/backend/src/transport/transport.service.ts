import { Injectable } from '@nestjs/common';

@Injectable()
export class TransportService {
  private parkingZones = [
    { zoneId: 'Zone A', name: 'West Concourse Parking', totalSpots: 800, occupiedSpots: 620 },
    { zoneId: 'Zone B', name: 'East Concourse Parking', totalSpots: 900, occupiedSpots: 410 },
    { zoneId: 'Zone C', name: 'VVIP Direct VIP Lot', totalSpots: 250, occupiedSpots: 215 },
    { zoneId: 'Zone D', name: 'South Accessible Lot', totalSpots: 300, occupiedSpots: 112 },
    { zoneId: 'Zone E', name: 'North Inflow Stadium Lot', totalSpots: 1200, occupiedSpots: 940 },
    { zoneId: 'Zone F', name: 'Media Crew & Satellite Lot', totalSpots: 200, occupiedSpots: 85 },
  ];

  private shuttles = [
    { shuttleId: 'S1', name: 'North Gate 1 Express', status: 'ACTIVE', nextArrivalMin: 3, route: 'Zone E ⇆ Gate 1' },
    { shuttleId: 'S2', name: 'East Gate 2 & 3 Link', status: 'ACTIVE', nextArrivalMin: 5, route: 'Zone B ⇆ Gate 2 & Gate 3' },
    { shuttleId: 'S3', name: 'South Gate 4 & 6 Accessible', status: 'ACTIVE', nextArrivalMin: 2, route: 'Zone D ⇆ Gate 4 & Gate 6' },
    { shuttleId: 'S4', name: 'West Gate 5 & 7 Shuttle', status: 'ACTIVE', nextArrivalMin: 6, route: 'Zone A ⇆ Gate 5 & Gate 7' },
    { shuttleId: 'S5', name: 'VIP Direct Gateway', status: 'ACTIVE', nextArrivalMin: 4, route: 'Zone C ⇆ Gate 8 (VVIP)' },
    { shuttleId: 'S6', name: 'Media Press Shuttle', status: 'DELAYED', nextArrivalMin: 14, route: 'Zone F ⇆ Media Stand Hub' },
  ];

  async getParkingStatus() {
    return this.parkingZones;
  }

  async getShuttleStatus() {
    return this.shuttles;
  }

  async updateParkingOccupancy(zoneId: string, occupiedSpots: number) {
    const zone = this.parkingZones.find((z) => z.zoneId === zoneId);
    if (zone) {
      zone.occupiedSpots = occupiedSpots;
      return zone;
    }
    throw new Error('Parking zone not found');
  }

  async updateShuttleStatus(shuttleId: string, status: string, nextArrivalMin: number) {
    const shuttle = this.shuttles.find((s) => s.shuttleId === shuttleId);
    if (shuttle) {
      shuttle.status = status;
      shuttle.nextArrivalMin = nextArrivalMin;
      return shuttle;
    }
    throw new Error('Shuttle not found');
  }
}
