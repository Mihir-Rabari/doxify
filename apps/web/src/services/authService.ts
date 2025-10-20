import api from './api';
import { AuthResponse, LoginData, RegisterData, User, ApiResponse } from '@/types';

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    console.log('🔷 [FRONTEND] Login request:', { email: data.email });
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
    console.log('✅ [FRONTEND] Login response received');
    return response.data.data!;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    console.log('🔷 [FRONTEND] Register request:', { email: data.email, name: data.name });
    console.log('🔷 [FRONTEND] Full request data:', data);
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', data);
    console.log('✅ [FRONTEND] Register response received:', response.status);
    console.log('✅ [FRONTEND] Response data:', response.data);
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
