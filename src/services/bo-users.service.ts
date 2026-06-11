import { httpBackOfficeGet, httpBackOfficePost, httpBackOfficeDelete, httpBackOfficePatch } from './http';
import { resolveImageUrl } from '@/lib/imageUrl';

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

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  email: string;
  parentUserId?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  dob?: string; // YYYY-MM-DD
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
      const response = await httpBackOfficeGet<{ data: UserStats }>('/backoffice/users/stats', params);
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
      const response = await httpBackOfficeGet<UserListResponse>('/backoffice/users/', {
        role: params?.role || 'all',
        sortBy: params?.sortBy || 'createdAt',
        sortOrder: params?.sortOrder || 'desc',
        page: params?.page || 1,
        limit: params?.limit || 20,
        ...(params?.search && { search: params.search }),
      });
      // Normalize avatar/image fields for UI
      if (response && response.data && Array.isArray(response.data)) {
        const mapped = response.data.map((u: any) => ({
          ...u,
          avatarUrl: u.avatarUrl || u.avatar || resolveImageUrl(u) || null,
          joinedDate: u.joinedDate || u.createdAt || u.created_at || u.joined_date || null,
        }));
        return { ...response, data: mapped };
      }
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
      const response = await httpBackOfficePost<CreateUserResponse>('/backoffice/users/dojo-owner', data);
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
      const response = await httpBackOfficePost<CreateUserResponse>('/backoffice/users/parent', data);
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
      const response = await httpBackOfficePost<CreateUserResponse>('/backoffice/users/instructor', data);
      return response;
    } catch (error) {
      console.error('Failed to create instructor:', error);
      throw error;
    }
  }

  /**
   * Create a new Student (child) profile
   */
  async createStudent(data: CreateStudentRequest): Promise<CreateUserResponse> {
    try {
      const response = await httpBackOfficePost<CreateUserResponse>('/backoffice/users/student', data);
      return response;
    } catch (error) {
      console.error('Failed to create student:', error);
      throw error;
    }
  }

  /**
   * Export a single user's data as CSV
   * @param userId The user id to export
   */
  async exportUser(userId: string): Promise<Blob> {
    try {
      const response = await fetch(
        `https://apis.dojoconnect.app/api/backoffice/users/${userId}/export`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('dojoconnect_token') || ''}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to export user');
      return await response.blob();
    } catch (error) {
      console.error('Failed to export user:', error);
      throw error;
    }
  }

  /**
   * Update a user's profile fields
   * @param userId backend id or email identifier
   */
  async updateUser(userId: string, data: Partial<CreateStudentRequest & CreateInstructorRequest & CreateDojoOwnerRequest>): Promise<CreateUserResponse> {
    try {
      const response = await httpBackOfficePatch<CreateUserResponse>(`/backoffice/users/${userId}`, data);
      return response;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }

  /**
   * Update user's status (active/inactive/disabled)
   */
  async updateUserStatus(userId: string, status: string): Promise<CreateUserResponse> {
    try {
      const response = await httpBackOfficePatch<CreateUserResponse>(`/backoffice/users/${userId}/status`, { status });
      return response;
    } catch (error) {
      console.error('Failed to update user status:', error);
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

  /**
   * Get a single user by id, return null for 401/404 instead of throwing.
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const response = await httpBackOfficeGet<any>(`/backoffice/users/${userId}`);
      const d = response?.data || response || null;
      if (!d) return null;
      // normalize minimal fields
      return {
        id: d.id,
        firstName: d.firstName || d.first_name || '',
        lastName: d.lastName || d.last_name || '',
        email: d.email || d.user_email || '',
        avatarUrl: d.avatarUrl || d.avatar || resolveImageUrl(d) || null,
        role: d.role || 'parent',
        joinedDate: d.createdAt || d.created_at || null,
        lastActivity: d.lastActivity || d.last_activity || null,
        status: d.status || 'active'
      } as User;
    } catch (err: any) {
      // If unauthorized or not found, return null to allow graceful UI fallback
      if (err?.response?.status === 401 || err?.response?.status === 404) return null;
      console.error('getUserById failed', err);
      throw err;
    }
  }
}

export const boUsersService = new BackOfficeUsersService();
