import { httpBackOfficePost } from '@/services/http';
import { storeTokens, clearTokens } from '@/lib/tokenStorage';

export interface AdminData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    admin: AdminData;
  };
  message: string;
}

export interface AuthResponse {
  data?: {
    resetToken?: string;
    accessToken?: string;
    refreshToken?: string;
    admin?: AdminData;
  };
  message: string;
}

export interface RefreshResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    admin: AdminData;
  };
  message: string;
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await httpBackOfficePost<LoginResponse>('/backoffice/auth/login', {
      email,
      password,
    });

    // Store tokens on successful login
    if (response.data?.accessToken && response.data?.refreshToken) {
      storeTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

/**
 * Request password reset via email
 */
export async function requestPasswordReset(email: string): Promise<AuthResponse> {
  try {
    const response = await httpBackOfficePost<AuthResponse>('/backoffice/auth/password/reset/request', {
      email,
    });
    return response;
  } catch (error) {
    console.error('Password reset request failed:', error);
    throw error;
  }
}

/**
 * Verify OTP for password reset
 */
export async function verifyPasswordResetOtp(
  email: string,
  otp: string
): Promise<AuthResponse> {
  try {
    const response = await httpBackOfficePost<AuthResponse>(
      '/backoffice/auth/password/reset/verify',
      {
        email,
        otp,
      }
    );
    return response;
  } catch (error) {
    console.error('OTP verification failed:', error);
    throw error;
  }
}

/**
 * Reset password with reset token
 */
export async function resetPassword(
  newPassword: string,
  resetToken: string
): Promise<AuthResponse> {
  try {
    const response = await httpBackOfficePost<AuthResponse>('/backoffice/auth/password/reset', {
      newPassword,
      resetToken,
    });
    return response;
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
}

/**
 * Refresh authentication tokens
 */
export async function refreshAuth(refreshToken: string): Promise<RefreshResponse> {
  try {
    const response = await httpBackOfficePost<RefreshResponse>('/backoffice/auth/refresh', {
      refreshToken,
    });

    // Update stored tokens
    if (response.data?.accessToken && response.data?.refreshToken) {
      storeTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearTokens();
    throw error;
  }
}

/**
 * Logout and invalidate refresh token
 */
export async function logout(refreshToken: string): Promise<AuthResponse> {
  try {
    const response = await httpBackOfficePost<AuthResponse>('/backoffice/auth/logout', {
      refreshToken,
    });

    // Clear tokens on logout
    clearTokens();

    return response;
  } catch (error) {
    console.error('Logout failed:', error);
    // Clear tokens regardless of error
    clearTokens();
    throw error;
  }
}

/**
 * Request email update - sends verification code to new email
 */
export async function requestEmailUpdate(
  password: string,
  newEmail: string
): Promise<AuthResponse> {
  try {
    const response = await httpBackOfficePost<AuthResponse>(
      '/backoffice/auth/email/update/request',
      {
        password,
        newEmail,
      }
    );
    return response;
  } catch (error) {
    console.error('Email update request failed:', error);
    throw error;
  }
}

/**
 * Verify email update with OTP
 */
export async function verifyEmailUpdate(otp: string): Promise<AuthResponse> {
  try {
    const response = await httpBackOfficePost<AuthResponse>(
      '/backoffice/auth/email/update/verify',
      {
        otp,
      }
    );
    return response;
  } catch (error) {
    console.error('Email update verification failed:', error);
    throw error;
  }
}

/**
 * Request email verification - sends code to current email
 */
export async function requestEmailVerification(): Promise<AuthResponse> {
  try {
    const response = await httpBackOfficePost<AuthResponse>(
      '/backoffice/auth/email/verification/request',
      {}
    );
    return response;
  } catch (error) {
    console.error('Email verification request failed:', error);
    throw error;
  }
}

/**
 * Confirm email verification with OTP
 */
export async function confirmEmailVerification(otp: string): Promise<AuthResponse> {
  try {
    const response = await httpBackOfficePost<AuthResponse>(
      '/backoffice/auth/email/verification/confirm',
      {
        otp,
      }
    );
    return response;
  } catch (error) {
    console.error('Email verification confirmation failed:', error);
    throw error;
  }
}

/**
 * Seed initial admin (creates first admin)
 * Uses main API endpoint: https://apis.dojoconnect.app/api
 */
export async function seedAdmin(): Promise<AuthResponse> {
  try {
    const { httpPost } = await import('@/services/http');
    const response = await httpPost<AuthResponse>('/backoffice/auth/seed');
    return response;
  } catch (error) {
    console.error('Admin seed failed:', error);
    throw error;
  }
}
