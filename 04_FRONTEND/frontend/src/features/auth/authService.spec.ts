import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './authService';

describe('authService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  describe('login', () => {
    it('should successfully login and return auth response', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@test.com', name: 'Test', role: 'FAN' },
        accessToken: 'mock-token',
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await authService.login({ email: 'test@test.com', password: 'password' });
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/login'), expect.any(Object));
    });

    it('should throw an error when API returns error response', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid credentials' }),
      });

      await expect(
        authService.login({ email: 'test@test.com', password: 'wrong' })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should successfully register and return user data', async () => {
      const mockUser = { id: '1', email: 'test@test.com', name: 'Test', role: 'FAN' };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await authService.register({
        email: 'test@test.com',
        password: 'password',
        name: 'Test',
        role: 'FAN',
      });
      expect(result).toEqual(mockUser);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/register'), expect.any(Object));
    });

    it('should throw an error on failed registration', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Email already exists' }),
      });

      await expect(
        authService.register({
          email: 'test@test.com',
          password: 'password',
          name: 'Test',
          role: 'FAN',
        })
      ).rejects.toThrow('Email already exists');
    });
  });
});
