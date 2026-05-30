import { httpBackOfficeGet, httpBackOfficePost, httpBackOfficeDelete } from './http';

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

export interface CreateDojoOwnerRequest {
  firstName: string;
  lastName: string;
  email: string;
  dojoName: string;
  dojoLocation: string;
}

export interface CreateParentRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateInstructorRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateUserResponse {
  data: {
    userId: string;
    email: string;
  };
  message: string;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
  data: null;
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

  /**
   * Create a new Dojo Owner
   * @param data Dojo owner information
   * @returns Created user details
   */
  async createDojoOwner(data: CreateDojoOwnerRequest): Promise<CreateUserResponse> {
    try {
      const response = await httpBackOfficePost<CreateUserResponse>('/users/dojo-owner', data);
      return response;
    } catch (error) {
      console.error('Failed to create dojo owner:', error);
      throw error;
    }
  }

  /**
   * Create a new Parent
   * @param data Parent information
   * @returns Created user details
   */
  async createParent(data: CreateParentRequest): Promise<CreateUserResponse> {
    try {
      const response = await httpBackOfficePost<CreateUserResponse>('/users/parent', data);
      return response;
    } catch (error) {
      console.error('Failed to create parent:', error);
      throw error;
    }
  }

  /**
   * Create a new Instructor
   * @param data Instructor information
   * @returns Created user details
   */
  async createInstructor(data: CreateInstructorRequest): Promise<CreateUserResponse> {
    try {
      const response = await httpBackOfficePost<CreateUserResponse>('/users/instructor', data);
      return response;
    } catch (error) {
      console.error('Failed to create instructor:', error);
      throw error;
    }
  }

  /**
   * Delete a user by ID
   * @param userId The ID of the user to delete
   * @returns Deletion response
   */
  async deleteUser(userId: string): Promise<DeleteUserResponse> {
    try {
      const response = await httpBackOfficeDelete<DeleteUserResponse>(`/backoffice/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  }
}

export const boUsersService = new BackOfficeUsersService();
