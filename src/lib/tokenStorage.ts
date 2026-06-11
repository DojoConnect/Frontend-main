// JWT Token Storage Management
// Handles both accessToken and refreshToken for Back Office authentication

const ACCESS_TOKEN_KEY = 'dojoconnect_access_token';
const REFRESH_TOKEN_KEY = 'dojoconnect_refresh_token';

export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * @deprecated Use getStoredAccessToken instead
 */
export function getStoredToken(): string | null {
  return getStoredAccessToken();
}

export function storeTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export async function refreshStoredToken(): Promise<string | null> {
  // Use a module-level promise to ensure only one refresh request runs at a time
  // This prevents multiple concurrent 401s from creating a refresh storm.
  // eslint-disable-next-line no-var
  if ((globalThis as any).__dojoconnect_refresh_promise) {
    return (globalThis as any).__dojoconnect_refresh_promise as Promise<string | null>;
  }

  const refreshFlow = (async (): Promise<string | null> => {
    try {
      const refreshToken = getStoredRefreshToken();
      if (!refreshToken) {
        clearTokens();
        return null;
      }

      // Import back-office http client here to avoid circular dependency
      const { httpBackOffice } = await import('@/services/http');

      const response = await httpBackOffice.post<{
        data: { accessToken: string; refreshToken: string };
        message: string;
      }>('/backoffice/auth/refresh', { refreshToken });

      if (response.data?.accessToken && response.data?.refreshToken) {
        storeTokens(response.data.accessToken, response.data.refreshToken);
        return response.data.accessToken;
      }

      clearTokens();
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearTokens();
      return null;
    } finally {
      // clear the global promise once done
      try {
        delete (globalThis as any).__dojoconnect_refresh_promise;
      } catch {}
    }
  })();

  // store promise globally so concurrent callers can await it
  (globalThis as any).__dojoconnect_refresh_promise = refreshFlow;
  return refreshFlow;
}

export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiryTime;
  } catch {
    return true;
  }
}
