export type Role = 'FAN' | 'VOLUNTEER' | 'OPERATIONS' | 'SECURITY' | 'MEDICAL' | 'TRANSPORT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  role?: Role;
}

