import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling + auto refresh
let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

function onRefreshed(token: string | null) {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const storedRt = localStorage.getItem('refreshToken');
          const refreshResp = await api.post('/api/auth/refresh', storedRt ? { refreshToken: storedRt } : {});
          const newToken: string | undefined = refreshResp.data?.data?.token;
          const newRt: string | undefined = refreshResp.data?.data?.refreshToken;
          if (newToken) {
            localStorage.setItem('token', newToken);
          }
          if (newRt) {
            localStorage.setItem('refreshToken', newRt);
          }
          onRefreshed(newToken || null);
          return api(originalRequest);
        } catch (e) {
          onRefreshed(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('refreshToken');
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }

      // queue pending requests while refreshing
      return new Promise((resolve, reject) => {
        pendingRequests.push((token) => {
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          resolve(api(originalRequest));
        });
      });
    }

    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
