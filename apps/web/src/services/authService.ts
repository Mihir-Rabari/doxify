import api from './api';
import { AuthResponse, LoginData, RegisterData, User, ApiResponse } from '@/types';

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
    return response.data.data!;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', data);
    return response.data.data!;
  },

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/api/auth/me');
    return response.data.data!;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
