import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';
import { authService } from './authService';

vi.mock('./authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });
  });

  it('should initialize with default states', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  describe('login action', () => {
    it('should successfully update user and token on successful login', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@test.com', name: 'Test', role: 'FAN' as const },
        accessToken: 'mock-token',
      };
      (authService.login as any).mockResolvedValueOnce(mockResponse);

      await useAuthStore.getState().login({ email: 'test@test.com', password: 'password' });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockResponse.user);
      expect(state.token).toBe(mockResponse.accessToken);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should set error state on failed login', async () => {
      (authService.login as any).mockRejectedValueOnce(new Error('Auth failed'));

      await expect(
        useAuthStore.getState().login({ email: 'test@test.com', password: 'wrong' })
      ).rejects.toThrow('Auth failed');

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Auth failed');
    });
  });

  describe('logout action', () => {
    it('should reset user and token states', () => {
      useAuthStore.setState({
        user: { id: '1', email: 'test@test.com', name: 'Test', role: 'FAN' },
        token: 'active-token',
      });

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });
  });

  describe('clearError action', () => {
    it('should reset error state to null', () => {
      useAuthStore.setState({ error: 'Some error' });
      useAuthStore.getState().clearError();
      expect(useAuthStore.getState().error).toBeNull();
    });
  });
});
