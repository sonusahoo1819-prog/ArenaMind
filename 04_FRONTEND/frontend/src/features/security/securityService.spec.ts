import { describe, it, expect, vi, beforeEach } from 'vitest';
import { securityService } from './securityService';

describe('securityService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  describe('reportIncident', () => {
    it('should successfully submit an incident report', async () => {
      const mockIncident = {
        id: 'inc-123',
        title: 'scanner error',
        description: 'Gate A scanner broken',
        type: 'SECURITY',
        location: { zoneId: 'Gate A' },
        createdAt: '2026-07-10T00:00:00Z',
        status: 'REPORTED',
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockIncident,
      });

      const result = await securityService.reportIncident(
        'scanner error',
        'Gate A scanner broken',
        'SECURITY',
        { zoneId: 'Gate A' },
        'mock-token'
      );

      expect(result).toEqual(mockIncident);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/security/incident'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token',
          }),
        })
      );
    });

    it('should throw an error on failed incident reporting', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Bad request payload' }),
      });

      await expect(
        securityService.reportIncident('error', 'desc', 'SECURITY', {}, 'token')
      ).rejects.toThrow('Bad request payload');
    });
  });

  describe('triggerSOS', () => {
    it('should successfully dispatch emergency SOS panic signal', async () => {
      const mockSOS = {
        id: 'sos-123',
        title: 'EMERGENCY SOS ALERT',
        description: 'User initiated panic emergency signal.',
        type: 'SOS',
        location: { zoneId: 'Current Zone' },
        createdAt: '2026-07-10T00:00:00Z',
        status: 'REPORTED',
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSOS,
      });

      const result = await securityService.triggerSOS({ zoneId: 'Current Zone' }, 'mock-token');

      expect(result).toEqual(mockSOS);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/security/sos'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should throw error when SOS dispatch fails', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Gateway timed out' }),
      });

      await expect(
        securityService.triggerSOS({}, 'token')
      ).rejects.toThrow('Gateway timed out');
    });
  });

  describe('getIncidents', () => {
    it('should retrieve list of active security incidents', async () => {
      const mockList = [
        { id: '1', title: 'Incident A', type: 'SECURITY', status: 'REPORTED', location: { zoneId: 'Zone A' } },
      ];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockList,
      });

      const result = await securityService.getIncidents('token');
      expect(result).toEqual(mockList);
    });
  });
});
