import { NavigationRoute } from './index';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const navigationService = {
  async getRoute(start: string, end: string, accessible: boolean, emergency: boolean, token: string): Promise<NavigationRoute> {
    const response = await fetch(
      `${API_URL}/navigation/route?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&accessible=${accessible}&emergency=${emergency}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to fetch route');
    }
    return response.json();
  },
};
