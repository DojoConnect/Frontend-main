import { getStoredAccessToken, refreshStoredToken } from '@/lib/tokenStorage';

// Support local development by checking for environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://apis.dojoconnect.app/api';
const BACK_OFFICE_BASE_URL = process.env.NEXT_PUBLIC_BACK_OFFICE_API_URL || 'https://apis.dojoconnect.app/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private buildUrl(path: string, params?: Record<string, any>): string {
    const url = new URL(path.startsWith('http') ? path : `${this.baseURL}${path}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  private async request<T = any>(method: string, path: string, options: FetchOptions = {}): Promise<T> {
    const url = this.buildUrl(path, options.params);
    
    // Get auth token
    const token = getStoredAccessToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      let response = await fetch(url, {
        ...options,
        method,
        headers,
      });

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401) {
        try {
          const newToken = await refreshStoredToken();
          if (newToken) {
            headers.Authorization = `Bearer ${newToken}`;
            response = await fetch(url, {
              ...options,
              method,
              headers,
            });
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw new Error('Authentication failed');
        }
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const error = new Error(data?.message || `HTTP ${response.status}`);
        (error as any).response = { status: response.status, data };
        throw error;
      }

      return data as T;
    } catch (error: any) {
      console.error(`${method} ${path} failed:`, error);
      throw error;
    }
  }

  async get<T = any>(url: string, params?: any): Promise<T> {
    return this.request<T>('GET', url, { params });
  }

  async post<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>('POST', url, {
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>('PUT', url, {
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>('PATCH', url, {
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(url: string): Promise<T> {
    return this.request<T>('DELETE', url);
  }
}

export const httpClient = new HttpClient(API_BASE_URL);
export const httpBackOffice = new HttpClient(BACK_OFFICE_BASE_URL);

// Convenience functions
export const httpGet = <T = any>(url: string, params?: any): Promise<T> => httpClient.get<T>(url, params);
export const httpPost = <T = any>(url: string, data?: any): Promise<T> => httpClient.post<T>(url, data);
export const httpPut = <T = any>(url: string, data?: any): Promise<T> => httpClient.put<T>(url, data);
export const httpPatch = <T = any>(url: string, data?: any): Promise<T> => httpClient.patch<T>(url, data);
export const httpDelete = <T = any>(url: string): Promise<T> => httpClient.delete<T>(url);

// Back Office convenience functions
export const httpBackOfficeGet = <T = any>(url: string, params?: any): Promise<T> => httpBackOffice.get<T>(url, params);
export const httpBackOfficePost = <T = any>(url: string, data?: any): Promise<T> => httpBackOffice.post<T>(url, data);
export const httpBackOfficePut = <T = any>(url: string, data?: any): Promise<T> => httpBackOffice.put<T>(url, data);
export const httpBackOfficePatch = <T = any>(url: string, data?: any): Promise<T> => httpBackOffice.patch<T>(url, data);
export const httpBackOfficeDelete = <T = any>(url: string): Promise<T> => httpBackOffice.delete<T>(url);
