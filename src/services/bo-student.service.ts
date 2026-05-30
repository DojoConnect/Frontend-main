import { httpBackOfficeGet, httpBackOfficePost } from './http';

export interface StudentProfile {
  id: string;
  lastName: string;
  email: string;
  role: 'child';
  status: 'active' | 'inactive' | 'suspended';
  dob?: string;
  createdAt: string;
  studentId: string;
  parentId: string;
  experienceLevel?: string;
  enrolledAt: string;
  parent?: {
    fullName: string;
    email: string;
  };
  linkedDojo?: {
    dojoId: string;
    dojoName: string;
  };
  disabilities?: string | null;
  allergies?: string | null;
  medicalConditions?: string | null;
  requiresSpecialAssistance?: boolean | null;
}

export interface StudentProfileResponse {
  data: StudentProfile;
}

export interface StudentClass {
  enrollmentId: string;
  enrolledAt: string;
  enrollmentActive: number;
  classId: string;
  className: string;
  classLevel: string;
  classStatus: string;
  classPrice: string;
  subscriptionType: string;
  frequency: string;
  streetAddress: string;
  city: string;
}

export interface StudentClassesResponse {
  data: StudentClass[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface AttendanceSummary {
  presentDays: number;
  absentDays: number;
  lateDays: number;
  byClass: ClassAttendance[];
}

export interface ClassAttendance {
  classId: string;
  className: string;
  totalSessions: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  avgAttendance: number;
  firstAttended: string;
  lastAttended: string;
}

export interface AttendanceResponse {
  data: AttendanceSummary;
}

export interface SubscriptionData {
  subscription: {
    id: string;
    classId: string;
    studentId: string;
    stripeSubscriptionId: string;
    status: 'active' | 'paused' | 'cancelled';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    createdAt: string;
  };
  card: {
    cardBrand: string;
    cardLast4: string;
    expMonth: number;
    expYear: number;
    isDefault: boolean;
  };
}

export interface SubscriptionResponse {
  data: SubscriptionData;
}

export interface BillingHistoryEntry {
  id: string;
  referenceId: string;
  classId: string;
  className: string;
  studentName: string;
  amount: string;
  type: 'one_time' | 'recurring';
  status: 'successful' | 'failed' | 'pending';
  cardBrand: string;
  cardLast4: string;
  paidAt: string;
  createdAt: string;
}

export interface BillingHistoryResponse {
  data: BillingHistoryEntry[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  message: string;
  metaData?: Record<string, any>;
  createdAt: string;
}

export interface ActivitiesResponse {
  data: Activity[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

class BackOfficeStudentService {
  /**
   * Get student profile by user ID
   * @param userId The student user ID
   * @returns Student profile information
   */
  async getStudentProfile(userId: string): Promise<StudentProfileResponse> {
    try {
      const response = await httpBackOfficeGet<StudentProfileResponse>(`/backoffice/students/${userId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch student profile:', error);
      throw error;
    }
  }

  /**
   * Get classes enrolled by student
   * @param userId The student user ID
   * @param params Pagination parameters
   * @returns Paginated list of classes
   */
  async getStudentClasses(userId: string, params?: PaginationParams): Promise<StudentClassesResponse> {
    try {
      const response = await httpBackOfficeGet<StudentClassesResponse>(`/backoffice/students/${userId}/classes`, {
        page: params?.page || 1,
        limit: params?.limit || 20,
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch student classes:', error);
      throw error;
    }
  }

  /**
   * Export student's classes to CSV
   * @param userId The student user ID
   * @returns CSV file blob
   */
  async exportStudentClasses(userId: string): Promise<Blob> {
    try {
      const response = await fetch(
        `https://apis.dojoconnect.app/api/backoffice/students/${userId}/classes/export`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('dojoconnect_token') || ''}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to export classes');
      return await response.blob();
    } catch (error) {
      console.error('Failed to export student classes:', error);
      throw error;
    }
  }

  /**
   * Get attendance summary and details for student
   * @param userId The student user ID
   * @returns Attendance data including summary and by class breakdown
   */
  async getStudentAttendance(userId: string): Promise<AttendanceResponse> {
    try {
      const response = await httpBackOfficeGet<AttendanceResponse>(`/backoffice/students/${userId}/attendance`);
      return response;
    } catch (error) {
      console.error('Failed to fetch student attendance:', error);
      throw error;
    }
  }

  /**
   * Get subscription and payment card information for student
   * @param userId The student user ID
   * @returns Subscription details with payment card
   */
  async getStudentSubscription(userId: string): Promise<SubscriptionResponse> {
    try {
      const response = await httpBackOfficeGet<SubscriptionResponse>(`/backoffice/students/${userId}/subscription`);
      return response;
    } catch (error) {
      console.error('Failed to fetch student subscription:', error);
      throw error;
    }
  }

  /**
   * Get billing history for student
   * @param userId The student user ID
   * @param params Pagination parameters
   * @returns Paginated list of billing history
   */
  async getStudentBillingHistory(userId: string, params?: PaginationParams): Promise<BillingHistoryResponse> {
    try {
      const response = await httpBackOfficeGet<BillingHistoryResponse>(`/backoffice/students/${userId}/billing-history`, {
        page: params?.page || 1,
        limit: params?.limit || 20,
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch student billing history:', error);
      throw error;
    }
  }

  /**
   * Export student's billing history to CSV
   * @param userId The student user ID
   * @returns CSV file blob
   */
  async exportStudentBillingHistory(userId: string): Promise<Blob> {
    try {
      const response = await fetch(
        `https://apis.dojoconnect.app/api/backoffice/students/${userId}/billing-history/export`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('dojoconnect_token') || ''}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to export billing history');
      return await response.blob();
    } catch (error) {
      console.error('Failed to export student billing history:', error);
      throw error;
    }
  }

  /**
   * Get activity history for student
   * @param userId The student user ID
   * @param params Pagination parameters
   * @returns Paginated list of activities
   */
  async getStudentActivities(userId: string, params?: PaginationParams): Promise<ActivitiesResponse> {
    try {
      const response = await httpBackOfficeGet<ActivitiesResponse>(`/backoffice/students/${userId}/activities`, {
        page: params?.page || 1,
        limit: params?.limit || 20,
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch student activities:', error);
      throw error;
    }
  }
}

export const boStudentService = new BackOfficeStudentService();
