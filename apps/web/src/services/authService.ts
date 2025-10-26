import api from './api';
import { AuthResponse, LoginData, RegisterData, User, ApiResponse } from '@/types';

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
    const payload = response.data.data!;
    if (payload.token) localStorage.setItem('token', payload.token);
    if (payload.refreshToken) localStorage.setItem('refreshToken', payload.refreshToken);
    if (payload.user) localStorage.setItem('user', JSON.stringify(payload.user));
    return payload;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', data);
    const payload = response.data.data!;
    if (payload.token) localStorage.setItem('token', payload.token);
    if (payload.refreshToken) localStorage.setItem('refreshToken', payload.refreshToken);
    if (payload.user) localStorage.setItem('user', JSON.stringify(payload.user));
    return payload;
  },

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/api/auth/me');
    return response.data.data!;
  },

  async logout() {
    try { await api.post('/api/auth/logout', {}); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
};
