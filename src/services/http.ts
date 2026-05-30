import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getStoredToken, refreshStoredToken } from '@/lib/tokenStorage';

// Support local development by checking for environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://apis.dojoconnect.app/api';

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshStoredToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            // Token refresh failed, redirect to login or handle appropriately
            console.error('Token refresh failed:', refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, params?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, { params });
    return response.data;
  }

  async post<T = any>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(url, data);
    return response.data;
  }

  async put<T = any>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(url, data);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.patch(url, data);
    return response.data;
  }

  async delete<T = any>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url);
    return response.data;
  }
}

export const httpClient = new HttpClient();

// Convenience functions
export const httpGet = <T = any>(url: string, params?: any): Promise<T> => httpClient.get<T>(url, params);
export const httpPost = <T = any>(url: string, data?: any): Promise<T> => httpClient.post<T>(url, data);
export const httpPut = <T = any>(url: string, data?: any): Promise<T> => httpClient.put<T>(url, data);
export const httpPatch = <T = any>(url: string, data?: any): Promise<T> => httpClient.patch<T>(url, data);
export const httpDelete = <T = any>(url: string): Promise<T> => httpClient.delete<T>(url);
