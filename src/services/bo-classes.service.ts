import { httpBackOfficeGet } from './http';
import { resolveImageUrl } from '@/lib/imageUrl';

// Pagination params
interface PaginationParams {
  page?: number;
  limit?: number;
}

// List classes filters
interface ListClassesParams extends PaginationParams {
  search?: string;
  dojoId?: string;
  status?: 'active' | 'inactive';
}

// Class in list
interface ClassSummary {
  id: string;
  name: string;
  level: string;
  status: 'active' | 'inactive';
  capacity: number;
  subscriptionType: string;
  price: string;
  frequency: string;
  dojoName: string;
  instructorName: string;
  enrolledStudents: number;
  createdAt: string;
}

interface ClassesListResponse {
  data: ClassSummary[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

// Class details
interface ClassDetails {
  id: string;
  name: string;
  level: string;
  status: 'active' | 'inactive';
  capacity: number;
  description: string;
  minAge: number;
  maxAge: number;
  streetAddress: string;
  city: string;
  gradingDate: string;
  frequency: string;
  subscriptionType: string;
  price: string;
  instructorName: string;
  instructorEmail: string;
  dojoInstructorId: string;
  dojoName: string;
  enrolledStudents: number;
  sessionsCompleted: number;
  avgAttendanceRate: number;
  createdAt: string;
}

interface ClassDetailsResponse {
  data: ClassDetails;
}

// Student in class
interface ClassStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'inactive';
  enrolledDate: string;
  lastActivityDate: string;
  enrollmentActive: number;
}

interface ClassStudentsListResponse {
  data: ClassStudent[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

// Schedule entry
interface ClassScheduleEntry {
  id: string;
  classId: string;
  weekday: string;
  startTime: string;
  endTime: string;
  initialClassDate: string;
}

interface ClassScheduleResponse {
  data: ClassScheduleEntry[];
}

// Attendance summary
interface LowAttendanceStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  attendancePercentage: number;
  sessionsHeld: number;
}

interface AttendanceSummary {
  summary: {
    totalSessions: number;
    avgAttendanceRate: number;
  };
  lowAttendanceStudents: LowAttendanceStudent[];
}

interface AttendanceSummaryResponse {
  data: AttendanceSummary;
}

// Attendance history entry
interface AttendanceHistoryEntry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  attendancePercentage: number;
  sessionsHeld: number;
  sessionsMissed: number;
  lastAttendedDate: string;
  enrollmentActive: number;
}

interface AttendanceHistoryResponse {
  data: AttendanceHistoryEntry[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

// Subscription summary
interface SubscriptionSummary {
  totalRevenue: string;
  activeSubscriptions: number;
  overdueSubscriptions: number;
}

interface SubscriptionSummaryResponse {
  data: SubscriptionSummary;
}

// Payment history entry
interface PaymentHistoryEntry {
  id: string;
  referenceId: string;
  className: string;
  studentName: string;
  amount: string;
  type: string;
  status: string;
  cardBrand: string;
  cardLast4: string;
  paidAt: string;
  createdAt: string;
}

interface PaymentHistoryResponse {
  data: PaymentHistoryEntry[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

// Activity entry
interface ClassActivity {
  activityType: string;
  description: string;
  createdAt: string;
}

interface ClassActivitiesResponse {
  data: ClassActivity[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

class BackOfficeClassesService {
  /**
   * List all classes with optional filters
   * GET /backoffice/classes
   */
  async listClasses(
    params?: ListClassesParams
  ): Promise<ClassesListResponse> {
    try {
      const response = await httpBackOfficeGet<ClassesListResponse>(
        '/backoffice/classes',
        params
      );
      if (response && response.data && Array.isArray(response.data)) {
        const mapped = response.data.map((c: any) => ({
          ...c,
          imageUrl: c.imageUrl || c.image || resolveImageUrl(c) || null,
        }));
        return { ...response, data: mapped };
      }
      return response;
    } catch (error) {
      console.error('Failed to fetch classes list:', error);
      throw error;
    }
  }

  /**
   * Get single class details
   * GET /backoffice/classes/:classId
   */
  async getClassDetails(classId: string): Promise<ClassDetails> {
    try {
      const response = await httpBackOfficeGet<ClassDetailsResponse>(
        `/backoffice/classes/${classId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch class details for ${classId}:`, error);
      throw error;
    }
  }

  /**
   * Get students in a class (paginated)
   * GET /backoffice/classes/:classId/students
   */
  async getClassStudents(
    classId: string,
    params?: PaginationParams
  ): Promise<ClassStudentsListResponse> {
    try {
      const response = await httpBackOfficeGet<ClassStudentsListResponse>(
        `/backoffice/classes/${classId}/students`,
        params
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch students for class ${classId}:`, error);
      throw error;
    }
  }

  /**
   * Export class students as CSV
   * GET /backoffice/classes/:classId/students/export
   */
  async exportClassStudents(classId: string): Promise<Blob> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_OFFICE_API_URL || 'https://apis.dojoconnect.app/api'}/backoffice/classes/${classId}/students/export`,
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
      console.error(`Failed to export students for class ${classId}:`, error);
      throw error;
    }
  }

  /**
   * Get class schedule
   * GET /backoffice/classes/:classId/schedule
   */
  async getClassSchedule(classId: string): Promise<ClassScheduleEntry[]> {
    try {
      const response = await httpBackOfficeGet<ClassScheduleResponse>(
        `/backoffice/classes/${classId}/schedule`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch schedule for class ${classId}:`, error);
      throw error;
    }
  }

  /**
   * Get attendance summary for a class
   * GET /backoffice/classes/:classId/attendance
   */
  async getClassAttendanceSummary(
    classId: string
  ): Promise<AttendanceSummary> {
    try {
      const response = await httpBackOfficeGet<AttendanceSummaryResponse>(
        `/backoffice/classes/${classId}/attendance`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch attendance summary for class ${classId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get attendance history for a class (paginated)
   * GET /backoffice/classes/:classId/attendance/history
   */
  async getClassAttendanceHistory(
    classId: string,
    params?: PaginationParams
  ): Promise<AttendanceHistoryResponse> {
    try {
      const response = await httpBackOfficeGet<AttendanceHistoryResponse>(
        `/backoffice/classes/${classId}/attendance/history`,
        params
      );
      return response;
    } catch (error) {
      console.error(
        `Failed to fetch attendance history for class ${classId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get subscription summary for a class
   * GET /backoffice/classes/:classId/subscription-summary
   */
  async getClassSubscriptionSummary(
    classId: string
  ): Promise<SubscriptionSummary> {
    try {
      const response = await httpBackOfficeGet<SubscriptionSummaryResponse>(
        `/backoffice/classes/${classId}/subscription-summary`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch subscription summary for class ${classId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get payment history for a class (paginated)
   * GET /backoffice/classes/:classId/payment-history
   */
  async getClassPaymentHistory(
    classId: string,
    params?: PaginationParams
  ): Promise<PaymentHistoryResponse> {
    try {
      const response = await httpBackOfficeGet<PaymentHistoryResponse>(
        `/backoffice/classes/${classId}/payment-history`,
        params
      );
      return response;
    } catch (error) {
      console.error(
        `Failed to fetch payment history for class ${classId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Export class payment history as CSV
   * GET /backoffice/classes/:classId/payment-history/export
   */
  async exportClassPaymentHistory(classId: string): Promise<Blob> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_OFFICE_API_URL || 'https://apis.dojoconnect.app/api'}/backoffice/classes/${classId}/payment-history/export`,
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
        `Failed to export payment history for class ${classId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get activities for a class (paginated)
   * GET /backoffice/classes/:classId/activities
   */
  async getClassActivities(
    classId: string,
    params?: PaginationParams
  ): Promise<ClassActivitiesResponse> {
    try {
      const response = await httpBackOfficeGet<ClassActivitiesResponse>(
        `/backoffice/classes/${classId}/activities`,
        params
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch activities for class ${classId}:`, error);
      throw error;
    }
  }
}

export const boClassesService = new BackOfficeClassesService();
