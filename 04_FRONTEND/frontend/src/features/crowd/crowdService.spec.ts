import { describe, it, expect, vi, beforeEach } from 'vitest';
import { crowdService } from './crowdService';

describe('crowdService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  describe('getStatus', () => {
    it('should successfully retrieve current crowd status metrics', async () => {
      const mockMetrics = [
        { id: '1', zoneId: 'Zone A', count: 120, density: 0.8, status: 'HIGH' },
      ];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetrics,
      });

      const result = await crowdService.getStatus('mock-token');
      expect(result).toEqual(mockMetrics);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/crowd/status'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token',
          }),
        })
      );
    });

    it('should throw an error on failed metrics fetching', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Unauthorized' }),
      });

      await expect(
        crowdService.getStatus('invalid')
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('getPredictions', () => {
    it('should retrieve live crowd flow predictions', async () => {
      const mockPredictions = [
        { zoneId: 'Zone B', currentDensity: 0.5, predictedDensity: 0.75, predictedWait: 4.5, status: 'HIGH' },
      ];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPredictions,
      });

      const result = await crowdService.getPredictions('token', 45);
      expect(result).toEqual(mockPredictions);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/crowd/prediction?offset=45'),
        expect.any(Object)
      );
    });
  });
});
