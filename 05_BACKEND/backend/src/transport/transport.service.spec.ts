import { Test, TestingModule } from '@nestjs/testing';
import { TransportService } from './transport.service';

describe('TransportService', () => {
  let service: TransportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransportService],
    }).compile();

    service = module.get<TransportService>(TransportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getParkingStatus', () => {
    it('should return initial parking zones array', async () => {
      const result = await service.getParkingStatus();
      expect(result.length).toBe(6);
      expect(result[0].zoneId).toBe('Zone A');
    });
  });

  describe('getShuttleStatus', () => {
    it('should return initial shuttle statuses', async () => {
      const result = await service.getShuttleStatus();
      expect(result.length).toBe(6);
      expect(result[0].shuttleId).toBe('S1');
    });
  });

  describe('updateParkingOccupancy', () => {
    it('should update occupancy correctly and return zone', async () => {
      const result = await service.updateParkingOccupancy('Zone A', 700);
      expect(result.occupiedSpots).toBe(700);
    });

    it('should throw error if zone is not found', async () => {
      await expect(
        service.updateParkingOccupancy('Zone-Unknown', 100)
      ).rejects.toThrow('Parking zone not found');
    });
  });

  describe('updateShuttleStatus', () => {
    it('should update shuttle status and arrival minutes', async () => {
      const result = await service.updateShuttleStatus('S1', 'DELAYED', 10);
      expect(result.status).toBe('DELAYED');
      expect(result.nextArrivalMin).toBe(10);
    });

    it('should throw error if shuttle is not found', async () => {
      await expect(
        service.updateShuttleStatus('S-Unknown', 'ACTIVE', 5)
      ).rejects.toThrow('Shuttle not found');
    });
  });
});
