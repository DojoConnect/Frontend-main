import { httpBackOfficeGet } from './http';

// Pagination params
interface PaginationParams {
  page?: number;
  limit?: number;
}

// Instructor Profile Response
interface InstructorProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'instructor';
  status: 'active' | 'inactive';
  gender: string;
  dob: string;
  createdAt: string;
  instructorId: string;
  dojoId: string;
  dojoName: string;
  assignedAt: string;
  notes: string | null;
}

interface InstructorProfileResponse {
  data: InstructorProfile;
}

// Class Response
interface InstructorClass {
  id: string;
  name: string;
  level: string;
  status: 'active' | 'inactive';
  capacity: number;
  description: string;
  subscriptionType: string;
  price: string;
  frequency: string;
  streetAddress: string;
  city: string;
  enrolledStudents: number;
  createdAt: string;
}

interface ClassesListResponse {
  data: InstructorClass[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

// Activity Response
interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  details?: Record<string, any>;
}

interface ActivitiesListResponse {
  data: Activity[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

class BackOfficeInstructorService {
  /**
   * Get instructor profile details
   * GET /backoffice/instructors/:userId
   */
  async getInstructorProfile(userId: string): Promise<InstructorProfile> {
    try {
      // Prefer instructor-specific endpoint, but fall back to users endpoints when missing.
      let response: any;
      try {
        response = await httpBackOfficeGet<any>(`/backoffice/instructors/${userId}`);
      } catch (e) {
        // try user-specific endpoint
        try {
          response = await httpBackOfficeGet<any>(`/backoffice/users/${userId}`);
        } catch (e2) {
          // last resort: fetch users list and find the matching id
          try {
            const list = await httpBackOfficeGet<any>(`/backoffice/users?page=1&limit=200`);
            const items = Array.isArray(list?.data) ? list.data : (list?.data || []);
            const found = items.find((u: any) => u.id === userId) || null;
            response = { data: found || {} };
          } catch (e3) {
            throw e; // rethrow original instructor endpoint error
          }
        }
      }
      // Response shape may vary: sometimes API returns { data: {...} } or {...} directly.
      let d: any = response;
      if (d && d.data) d = d.data;
      if (d && d.data) d = d.data;
      // Normalize backend shape to UI-friendly shape expected by components
      const _d: any = d || {};
      // Build a reliable avatar URL from multiple possible backend fields.
      const baseApi = process.env.NEXT_PUBLIC_BACK_OFFICE_API_URL || 'https://apis.dojoconnect.app/api';
      let avatarUrl: string | undefined;
      if (_d.avatarUrl) {
        avatarUrl = _d.avatarUrl;
      } else if (_d.avatar && typeof _d.avatar === 'string') {
        avatarUrl = _d.avatar.startsWith('http') ? _d.avatar : `${baseApi}/${_d.avatar.replace(/^\//, '')}`;
      } else if (_d.image || _d.imageUrl || _d.profileImage) {
        const possible = _d.image || _d.imageUrl || _d.profileImage;
        avatarUrl = typeof possible === 'string' && possible.startsWith('http') ? possible : `${baseApi}/${String(possible).replace(/^\//, '')}`;
      } else if (_d.avatarPublicId || _d.avatar_public_id || _d.imagePublicId || _d.image_public_id || _d.public_id) {
        const id = _d.avatarPublicId || _d.avatar_public_id || _d.imagePublicId || _d.image_public_id || _d.public_id;
        avatarUrl = `${baseApi}/images/${id}`;
      } else if (_d.image_path) {
        avatarUrl = `${baseApi}/${String(_d.image_path).replace(/^\//, '')}`;
      } else {
        avatarUrl = undefined;
      }

      const normalized: any = {
        ...d,
        // UI expects `name`, `joined_date`, `avatar`, and `userType` fields
        name: (_d.firstName || _d.first_name) ? `${_d.firstName || _d.first_name} ${_d.lastName || _d.last_name}`.trim() : (_d.username || ''),
        joined_date: _d.createdAt || _d.created_at || null,
        avatar: avatarUrl || _d.avatar || null,
        userType: _d.role || _d.userType || 'instructor',
        email: _d.email || _d.user_email,
        status: _d.status || _d.accountStatus || 'active',
        // Normalize assigned/dojo/classes/dates/activity fields that the UI reads
        assignedDojos: _d.assignedDojos || _d.assigned_dojos || (_d.dojoName ? [_d.dojoName] : []) || [],
        assigned_dates: _d.assigned_dates || _d.assignedDates || (_d.assignedAt ? [_d.assignedAt] : []) || [],
        assigned_classes: _d.assigned_classes || _d.assignedClasses || _d.classes || [],
        activityLog: _d.activityLog || _d.activity_log || _d.activities || [],
        notes: _d.notes || _d.note || null,
      };
      return normalized as InstructorProfile;
    } catch (error) {
      console.error(`Failed to fetch instructor profile for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get instructor's classes (paginated)
   * GET /backoffice/instructors/:userId/classes
   */
  async getInstructorClasses(
    userId: string,
    params?: PaginationParams
  ): Promise<ClassesListResponse> {
    try {
      const response = await httpBackOfficeGet<ClassesListResponse>(
        `/backoffice/instructors/${userId}/classes`,
        params
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch classes for instructor ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Export instructor's classes as CSV
   * GET /backoffice/instructors/:userId/classes/export
   */
  async exportInstructorClasses(userId: string): Promise<Blob> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_OFFICE_API_URL || 'https://apis.dojoconnect.app/api'}/backoffice/instructors/${userId}/classes/export`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('dojoconnect_token') || ''}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Export failed with status ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error(
        `Failed to export classes for instructor ${userId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get instructor activities (paginated)
   * GET /backoffice/instructors/:userId/activities
   */
  async getInstructorActivities(
    userId: string,
    params?: PaginationParams
  ): Promise<ActivitiesListResponse> {
    try {
      const response = await httpBackOfficeGet<ActivitiesListResponse>(
        `/backoffice/instructors/${userId}/activities`,
        params
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch activities for instructor ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Export instructor activities as CSV
   * GET /backoffice/instructors/:userId/activities/export
   */
  async exportInstructorActivities(userId: string): Promise<Blob> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_OFFICE_API_URL || 'https://apis.dojoconnect.app/api'}/backoffice/instructors/${userId}/activities/export`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('dojoconnect_token') || ''}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Export failed with status ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error(
        `Failed to export activities for instructor ${userId}:`,
        error
      );
      throw error;
    }
  }
}

export const boInstructorService = new BackOfficeInstructorService();
