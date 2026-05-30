import { httpBackOfficeGet } from './http';

export interface UserStats {
  dojoOwners: {
    count: number;
    percentageChange: number;
  };
  instructors: {
    count: number;
    percentageChange: number;
  };
  parents: {
    count: number;
    percentageChange: number;
  };
  children: {
    count: number;
    percentageChange: number;
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  role: 'child' | 'instructor' | 'parent' | 'dojo_owner';
  joinedDate: string;
  lastActivity: string | null;
  status: 'active' | 'inactive' | 'suspended';
}

export interface UserListResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface UserStatsParams {
  period?: 'today' | 'week' | 'month' | 'year' | 'custom';
  fromDate?: string;
  toDate?: string;
}

export interface ListUsersParams {
  role?: 'all' | 'dojo_owner' | 'child' | 'instructor' | 'parent';
  sortBy?: 'name' | 'email' | 'createdAt' | 'lastActivity';
  sortOrder?: 'desc' | 'asc';
  page?: number;
  limit?: number;
  search?: string;
}

class BackOfficeUsersService {
  /**
   * Get user statistics with optional date range filtering
   * @param params Period and date range parameters
   * @returns User statistics with percentage changes
   */
  async getUserStats(params?: UserStatsParams): Promise<{ data: UserStats }> {
    try {
      const response = await httpBackOfficeGet<{ data: UserStats }>('/users/stats', params);
      return response;
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      throw error;
    }
  }

  /**
   * List all users with filtering and sorting options
   * @param params Filter, sort, and pagination parameters
   * @returns Paginated list of users
   */
  async listUsers(params?: ListUsersParams): Promise<UserListResponse> {
    try {
      const response = await httpBackOfficeGet<UserListResponse>('/users/', {
        role: params?.role || 'all',
        sortBy: params?.sortBy || 'createdAt',
        sortOrder: params?.sortOrder || 'desc',
        page: params?.page || 1,
        limit: params?.limit || 20,
        ...(params?.search && { search: params.search }),
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }
}

export const boUsersService = new BackOfficeUsersService();
