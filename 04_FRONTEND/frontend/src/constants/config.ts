export const CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'http://127.0.0.1:5000',
  DEFAULT_ROLE: 'ORGANIZER',
  CCTV_CAMERAS: ['Cam 01', 'Cam 02', 'Cam 03', 'Cam 04'] as const,
  SEATING_ZONES: {
    VIP: 'VIP Platinum Lounge',
    GENERAL: 'Main Seating Deck',
  },
  THEMES: {
    DARK: 'dark',
    LIGHT: 'light',
  } as const,
  REFRESH_INTERVALS: {
    METRICS: 15000,
    CCTV: 50,
  },
};
